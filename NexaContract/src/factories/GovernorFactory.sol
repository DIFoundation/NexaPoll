// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GovernorFactory
 * @dev Deploys new DAOs (Governor + Timelock + Treasury).
 * Stores registry for frontend indexing.
 */
import "../core/DGPGovernor.sol";
import "../core/DGPTimelockController.sol";
import "../core/DGPTreasury.sol";

contract GovernorFactory {
    struct DAOConfig {
        address governor;
        address timelock;
        address treasury;
        address token;
        address creator;
        uint256 createdAt;
    }

    DAOConfig[] public daos;
    mapping(address => address[]) public daosByCreator;
    mapping(address => bool) public isDAO;

    event DAOCreated(
        address indexed governor,
        address indexed timelock,
        address indexed treasury,
        address token,
        address creator,
        uint256 daoId
    );

    /**
     * @dev Create a new DAO with Governor, Timelock, and Treasury
     * @param token Governance token (must implement IVotes)
     * @param votingDelay Delay before voting starts (in blocks)
     * @param votingPeriod Duration of voting period (in blocks)
     * @param proposalThreshold Minimum tokens needed to create proposal
     * @param timelockDelay Delay before execution (in seconds, min 1 day)
     * @param quorumPercentage Percentage of total supply needed for quorum (1-100)
     */
    function createDAO(
        IVotes token,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 timelockDelay,
        uint256 quorumPercentage
    ) external returns (address governor, address timelock, address treasury) {
        require(address(token) != address(0), "Invalid token address");
        require(votingPeriod > 0, "Voting period must be > 0");
        require(timelockDelay >= 1 days, "Timelock delay too short");
        require(quorumPercentage > 0 && quorumPercentage <= 100, "Invalid quorum percentage");

        // Step 1: Deploy Timelock
        address[] memory proposers = new address[](0); // Empty initially
        address[] memory executors = new address[](1);
        executors[0] = address(0); // Anyone can execute after timelock
        
        DGPTimelockController timelockContract = new DGPTimelockController(
            timelockDelay,
            proposers,
            executors,
            address(this) // Factory temporarily holds admin role
        );
        timelock = address(timelockContract);

        // Step 2: Deploy Governor
        DGPGovernor governorContract = new DGPGovernor(
            token,
            timelockContract,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage
        );
        governor = address(governorContract);

        // Step 3: Deploy Treasury (timelock is the controller)
        DGPTreasury treasuryContract = new DGPTreasury(timelock);
        treasury = address(treasuryContract);

        // Step 4: Configure roles
        bytes32 proposerRole = timelockContract.PROPOSER_ROLE();
        bytes32 executorRole = timelockContract.EXECUTOR_ROLE();
        bytes32 adminRole = timelockContract.DEFAULT_ADMIN_ROLE();

        // Grant proposer role to governor
        timelockContract.grantRole(proposerRole, governor);
        
        // Grant executor role to governor (and anyone via address(0) already set)
        timelockContract.grantRole(executorRole, governor);

        // Revoke factory's admin role (timelock becomes self-governing)
        timelockContract.renounceRole(adminRole, address(this));

        // Step 5: Register DAO
        uint256 daoId = daos.length;
        daos.push(DAOConfig({
            governor: governor,
            timelock: timelock,
            treasury: treasury,
            token: address(token),
            creator: msg.sender,
            createdAt: block.timestamp
        }));
        
        daosByCreator[msg.sender].push(governor);
        isDAO[governor] = true;

        emit DAOCreated(governor, timelock, treasury, address(token), msg.sender, daoId);
    }

    /**
     * @dev Get total number of DAOs created
     */
    function getDaoCount() external view returns (uint256) {
        return daos.length;
    }

    /**
     * @dev Get DAOs created by a specific address
     */
    function getDaosByCreator(address creator) external view returns (address[] memory) {
        return daosByCreator[creator];
    }

    /**
     * @dev Get DAO configuration by ID
     */
    function getDao(uint256 daoId) external view returns (DAOConfig memory) {
        require(daoId < daos.length, "DAO does not exist");
        return daos[daoId];
    }
}