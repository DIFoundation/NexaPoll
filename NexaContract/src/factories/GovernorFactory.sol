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
        string daoName;
        string metadataURI; // e.g. IPFS link or org description
        string daoDescription;
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
        string daoName,
        address token,
        TokenType tokenType,
        address creator,
        uint256 daoId
    );

    event TokenDeployed(address indexed token, TokenType tokenType, string tokenName, string tokenSymbol);

    function createDAO(
        string memory daoName,
        string memory daoDescription,
        string memory metadataURI,
        string memory tokenName,
        string memory tokenSymbol,
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
        timelock = _deployTimelock(timelockDelay);
        token = _deployToken(tokenType, tokenName, tokenSymbol, initialSupply, maxSupply, baseURI);
        governor = _deployGovernor(token, timelock, votingDelay, votingPeriod, proposalThreshold, quorumPercentage);
        treasury = _deployTreasury(timelock);

        _configureRoles(tokenType, token, governor, timelock);
        _recordDAO(daoName, daoDescription, metadataURI, governor, timelock, treasury, token, tokenType);
        _configureTimelockRoles(timelock, governor);
    }

    function _deployTimelock(uint256 delay) internal returns (address) { 
        address[] memory proposers;
        address[] memory executors;
        return address(new DGPTimelockController(delay, proposers, executors, address(this)));
    }
    function _deployToken(TokenType tokenType, string memory tokenName, string memory tokenSymbol, uint256 initialSupply, uint256 maxSupply, string memory baseURI) internal returns (address) {
        if (tokenType == TokenType.ERC20) {
            return address(new ERC20VotingPower(tokenName, tokenSymbol, initialSupply, maxSupply, msg.sender));
        } else {
            return address(new ERC721VotingPower(tokenName, tokenSymbol, maxSupply, baseURI));
        }
    }
    function _deployGovernor(address token, address timelock, uint256 votingDelay, uint256 votingPeriod, uint256 proposalThreshold, uint256 quorumPercentage) internal returns (address) {
        IVotes votesToken = IVotes(token);
        DGPTimelockController timelockController = DGPTimelockController(payable(timelock));
        return address(new DGPGovernor(
            votesToken,
            timelockController,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage,
            msg.sender
        ));
    }
    function _deployTreasury(address timelock) internal returns (address) {
        return address(new DGPTreasury(timelock, timelock));
    }
    function _configureRoles(TokenType tokenType, address token, address governor, address timelock) internal { 
    if (tokenType == TokenType.ERC20) {
        ERC20VotingPower erc20 = ERC20VotingPower(token);

        // Governor can mint directly (for member top-ups)
        erc20.grantRole(erc20.MINTER_ROLE(), address(governor));

        // Timelock can mint via approved proposals
        erc20.grantRole(erc20.MINTER_ROLE(), timelock);

        // Revoke factory's own minter role so it cannot mint after setup
        erc20.revokeRole(erc20.MINTER_ROLE(), address(this));

        // Transfer admin control of roles to Timelock
        erc20.grantRole(erc20.DEFAULT_ADMIN_ROLE(), timelock);

        // Factory renounces admin to make DAO self-governing
        erc20.renounceRole(erc20.DEFAULT_ADMIN_ROLE(), address(this));

    } else {
        ERC721VotingPower erc721 = ERC721VotingPower(token);

        erc721.grantRole(erc721.MINTER_ROLE(), address(governor));
        erc721.grantRole(erc721.MINTER_ROLE(), timelock);

        // Revoke factory's own minter role so it cannot mint after setup
        erc721.revokeRole(erc721.MINTER_ROLE(), address(this));

        erc721.grantRole(erc721.DEFAULT_ADMIN_ROLE(), timelock);
        erc721.renounceRole(erc721.DEFAULT_ADMIN_ROLE(), address(this));
    }
}

    function _configureTimelockRoles(address timelock, address governor) internal { 
        DGPTimelockController timelockContract = DGPTimelockController(payable(timelock));
        
        bytes32 proposerRole = timelockContract.PROPOSER_ROLE();
        bytes32 executorRole = timelockContract.EXECUTOR_ROLE();
        bytes32 adminRole = timelockContract.DEFAULT_ADMIN_ROLE();

        timelockContract.grantRole(proposerRole, governor);
        // allow anyone to execute queued operations (optional; change to governor if you want restricted execution)
        timelockContract.grantRole(executorRole, address(0));

        // Make governor the admin of timelock (so governance can change roles via proposals)
        timelockContract.grantRole(adminRole, governor);
        // factory renounces admin role on timelock
        timelockContract.renounceRole(adminRole, address(this));
    }

    function _recordDAO(string memory daoName, string memory daoDescription, string memory metadataURI, address governor, address timelock, address treasury, address token, TokenType tokenType) internal { 
        uint256 daoId = daos.length;
        daos.push(DAOConfig({
            daoName: daoName,
            metadataURI: metadataURI,
            daoDescription: daoDescription,
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

        emit DAOCreated(governor, timelock, treasury, daoName, token, tokenType, msg.sender, daoId);
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

    function getDaosByTokenType(TokenType tokenType) external view returns (DAOConfig[] memory) {
        uint256 len = daos.length;
        DAOConfig[] memory temp = new DAOConfig[](len);
        uint256 count;
        for (uint256 i; i < len; ++i) {
            if (daos[i].tokenType == tokenType) temp[count++] = daos[i];
        }
        assembly { mstore(temp, count) }
        return temp;
    }

    function deleteDao(uint256 daoId) external {
        require(daoId < daos.length, "DAO does not exist");
        daos[daoId] = daos[daos.length - 1];
        daos.pop();
    }
}
