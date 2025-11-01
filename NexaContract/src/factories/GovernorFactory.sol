// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "../core/DGPGovernor.sol";
import "../core/DGPTimelockController.sol";
import "../core/DGPTreasury.sol";
import "../core/voting/ERC20VotingPower.sol";
import "../core/voting/ERC721VotingPower.sol";

contract GovernorFactory {
    using Clones for address;

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

    // Implementation addresses (logic contracts) — set at deploy time
    address public immutable governorImplementation;
    address public immutable timelockImplementation;
    address public immutable treasuryImplementation;

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

    /**
     * @dev Pass addresses of deployed logic contracts (implementations) to the factory.
     * The implementation contracts must be the clone-ready versions you already created.
     */
    constructor(
        address _governorImplementation,
        address _timelockImplementation,
        address _treasuryImplementation
    ) {
        require(_governorImplementation != address(0), "Gov impl required");
        require(_timelockImplementation != address(0), "Timelock impl required");
        require(_treasuryImplementation != address(0), "Treasury impl required");

        governorImplementation = _governorImplementation;
        timelockImplementation = _timelockImplementation;
        treasuryImplementation = _treasuryImplementation;
    }

    /**
     * @notice Create a new DAO (token, timelock clone, governor clone, treasury clone)
     */
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
        // 1) Deploy token (regular deploy)
        token = _deployToken(tokenType, tokenName, tokenSymbol, initialSupply, maxSupply, baseURI);
        emit TokenDeployed(token, tokenType, tokenName, tokenSymbol);

        // 2) Clone timelock and initialize (factory is temporary admin)
        timelock = _deployTimelock(timelockDelay);

        // 3) Clone governor and initialize (owner/admin of governor set to msg.sender)
        governor = _deployGovernor(token, timelock, votingDelay, votingPeriod, proposalThreshold, quorumPercentage, daoName);

        // 4) Clone treasury and initialize (timelock is controller)
        treasury = _deployTreasury(timelock, governor);

        // 5) Configure token & timelock roles
        _configureRoles(tokenType, token, governor, timelock);
        _recordDAO(daoName, daoDescription, metadataURI, governor, timelock, treasury, token, tokenType);

        // 6) Configure timelock roles (grant governor proposer/admin roles, create executor)
        _configureTimelockRoles(timelock, governor);
    }

    // ------------------ Internal deploy helpers (clones) ------------------

    function _deployTimelock(uint256 delay) internal returns (address) {
        // Clone the timelock implementation and initialize it.
        address timelockClone = timelockImplementation.clone();
        // Empty arrays for proposers/executors; we'll grant roles after init
        address;
        address;

        DGPTimelockController(payable(timelockClone)).initialize(delay, proposers, executors, address(this));
        return timelockClone;
    }

    function _deployToken(
        TokenType tokenType,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory baseURI
    ) internal returns (address) {
        if (tokenType == TokenType.ERC20) {
            // factory is msg.sender inside constructor here; keep as admin temporarily
            return address(new ERC20VotingPower(tokenName, tokenSymbol, initialSupply, maxSupply, msg.sender));
        } else {
            return address(new ERC721VotingPower(tokenName, tokenSymbol, maxSupply, baseURI));
        }
    }

    function _deployGovernor(
        address token,
        address timelock,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 quorumPercentage,
        string memory governorName
    ) internal returns (address) {
        address governorClone = governorImplementation.clone();
        // initialize(IVotes _token, TimelockController _timelock, uint256 _votingDelay, uint256 _votingPeriod, uint256 _proposalThreshold, uint256 quorumPercentage_, address admin, string memory governorName)
        DGPGovernor(governorClone).initialize(
            IVotes(token),
            DGPTimelockController(payable(timelock)),
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage,
            msg.sender,       // owner/admin of governor contract -> DAO creator
            governorName
        );
        return governorClone;
    }

    function _deployTreasury(address timelock, address governor) internal returns (address) {
        address treasuryClone = treasuryImplementation.clone();
        DGPTreasury(treasuryClone).initialize(timelock, governor);
        return treasuryClone;
    }

    // ------------------ Configuration helpers ------------------

    function _configureRoles(TokenType tokenType, address token, address governor, address timelock) internal {
        if (tokenType == TokenType.ERC20) {
            ERC20VotingPower erc20 = ERC20VotingPower(token);

            // Grant mint roles to governor & timelock, then remove factory privileges
            erc20.grantRole(erc20.MINTER_ROLE(), address(governor));
            erc20.grantRole(erc20.MINTER_ROLE(), timelock);
            erc20.revokeRole(erc20.MINTER_ROLE(), address(this));

            // Transfer admin control of roles to Timelock (DAO)
            erc20.grantRole(erc20.DEFAULT_ADMIN_ROLE(), timelock);
            erc20.renounceRole(erc20.DEFAULT_ADMIN_ROLE(), address(this));

        } else {
            ERC721VotingPower erc721 = ERC721VotingPower(token);

            erc721.grantRole(erc721.MINTER_ROLE(), address(governor));
            erc721.grantRole(erc721.MINTER_ROLE(), timelock);
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

        // Grant governor the ability to propose
        timelockContract.grantRole(proposerRole, governor);

        // Allow anyone to execute queued operations (optional)
        timelockContract.grantRole(executorRole, address(0));

        // Make governor the admin of timelock (so governance can change roles via proposals)
        timelockContract.grantRole(adminRole, governor);

        // Factory renounces admin role on timelock (factory was the initial admin)
        timelockContract.renounceRole(adminRole, address(this));
    }

    // ------------------ DAO registry ------------------

    function _recordDAO(
        string memory daoName,
        string memory daoDescription,
        string memory metadataURI,
        address governor,
        address timelock,
        address treasury,
        address token,
        TokenType tokenType
    ) internal {
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
        // You may want to restrict this to the DAO creator or owner for safety
        daos[daoId] = daos[daos.length - 1];
        daos.pop();
    }
}
