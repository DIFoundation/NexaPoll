// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "../core/DGPGovernor.sol";
import "../core/DGPTimelockController.sol";
import "../core/DGPTreasury.sol";
import "../core/voting/ERC20VotingPower.sol";
import "../core/voting/ERC721VotingPower.sol";

contract GovernorFactory {
    enum TokenType { ERC20, ERC721 }

    struct DAOConfig {
        address governor;
        address timelock;
        address treasury;
        address token;
        TokenType tokenType;
        address creator;
        uint256 createdAt;
    }

    DAOConfig[] private daos;
    mapping(address => address[]) private daosByCreator;
    mapping(address => bool) public isDAO;

    event DAOCreated(
        address indexed governor,
        address indexed timelock,
        address indexed treasury,
        address token,
        TokenType tokenType,
        address creator,
        uint256 daoId
    );

    /**
     * @dev Deploy a full DAO (token + governor + timelock + treasury)
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply For ERC20 only (ignored if ERC721)
     * @param votingDelay Voting delay in blocks
     * @param votingPeriod Voting duration in blocks
     * @param proposalThreshold Minimum tokens to propose
     * @param timelockDelay Delay before execution (seconds)
     * @param quorumPercentage % supply required for quorum
     * @param tokenType ERC20 or ERC721
     */
    function createDAO(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 timelockDelay,
        uint256 quorumPercentage,
        TokenType tokenType,
        string memory baseURI
    ) external returns (address governor, address timelock, address treasury, address token) {
        require(votingPeriod > 0, "Voting period must be > 0");
        require(timelockDelay >= 1 days, "Timelock delay too short");
        require(quorumPercentage > 0 && quorumPercentage <= 100, "Invalid quorum %");

        // Step 1: Deploy Token
        if (tokenType == TokenType.ERC20) {
            ERC20VotingPower erc20 = new ERC20VotingPower(name, symbol, initialSupply, maxSupply);
            // grant MINTER_ROLE to timelock (so DAO can mint later if proposals pass)
            erc20.grantRole(erc20.MINTER_ROLE(), timelock);
            // grant MINTER_ROLE to governor (admin) for member management
            erc20.grantRole(erc20.MINTER_ROLE(), address(governor));
            token = address(erc20);
        } else {
            ERC721VotingPower erc721 = new ERC721VotingPower(name, symbol, maxSupply, baseURI);
            // grant MINTER_ROLE to timelock
            erc721.grantRole(erc721.MINTER_ROLE(), timelock);
            // grant MINTER_ROLE to governor (admin) for member management
            erc721.grantRole(erc721.MINTER_ROLE(), address(governor));
            // mint at least one NFT to creator for initial voting power
            erc721.mint(msg.sender);
            token = address(erc721);
        }


        // Step 2: Deploy Timelock
        address[] memory proposers = new address[](1);
        proposers[0] = address(0); // placeholder, will set to governor after deployment
        
        address[] memory executors = new address[](1);
        executors[0] = address(0); // placeholder, will set to governor after deployment

        DGPTimelockController timelockContract = new DGPTimelockController(
            timelockDelay,
            proposers,
            executors,
            address(this)
        );

        timelock = address(timelockContract);

        // Step 3: Deploy Governor
        DGPGovernor governorContract = new DGPGovernor(
            IVotes(token),
            timelockContract,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage,
            msg.sender // admin
        );
        governor = address(governorContract);

        // Step 4: Deploy Treasury
        DGPTreasury treasuryContract = new DGPTreasury(timelock);
        treasury = address(treasuryContract);

        // Step 5: Configure roles
        bytes32 proposerRole = timelockContract.PROPOSER_ROLE();
        bytes32 executorRole = timelockContract.EXECUTOR_ROLE();
        bytes32 adminRole = timelockContract.DEFAULT_ADMIN_ROLE();

        timelockContract.grantRole(proposerRole, governor);
        timelockContract.grantRole(executorRole, governor);
        timelockContract.renounceRole(adminRole, address(this));

        // Step 6: Save DAO in registry
        uint256 daoId = daos.length;
        daos.push(DAOConfig({
            governor: governor,
            timelock: timelock,
            treasury: treasury,
            token: token,
            tokenType: tokenType,
            creator: msg.sender,
            createdAt: block.timestamp
        }));

        daosByCreator[msg.sender].push(governor);
        isDAO[governor] = true;

        emit DAOCreated(governor, timelock, treasury, token, tokenType, msg.sender, daoId);
    }

    // ------------------ Frontend helper views ------------------

    function getDaoCount() external view returns (uint256) {
        return daos.length;
    }

    function getDao(uint256 daoId) external view returns (DAOConfig memory) {
        require(daoId < daos.length, "DAO does not exist");
        return daos[daoId];
    }

    function getAllDaos() external view returns (DAOConfig[] memory) {
        return daos;
    }

    function getDaosByCreator(address creator) external view returns (address[] memory) {
        return daosByCreator[creator];
    }

    function getDaosByToken(address tokenAddr) external view returns (DAOConfig[] memory result) {
        uint256 count;
        for (uint256 i; i < daos.length; i++) {
            if (daos[i].token == tokenAddr) count++;
        }
        result = new DAOConfig[](count);
        uint256 idx;
        for (uint256 i; i < daos.length; i++) {
            if (daos[i].token == tokenAddr) {
                result[idx] = daos[i];
                idx++;
            }
        }
    }
}
