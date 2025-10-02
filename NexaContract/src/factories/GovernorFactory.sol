// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GovernorFactory
 * @dev Deploys new DAOs (Governor + Timelock + Treasury).
 * Stores registry for frontend indexing.
 */
import "./../core/DGPGovernor.sol";
import "./../core/DGPTimelockController.sol";
import "./../core/DGPTreasury.sol";

contract GovernorFactory {
    event DAOCreated(address governor, address timelock, address treasury);

    function createDAO(
        IVotes token,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 timelockDelay
    ) external returns (address governor, address timelock, address treasury) {
        // Step 1: Deploy Timelock
        address[] memory proposers = new address[](1);
        proposers[0] = msg.sender; // Temporarily set deployer as proposer
        address[] memory executors = new address[](1);
        executors[0] = address(0); // No executors initially
        DGPTimelockController timelockContract = new DGPTimelockController(timelockDelay, proposers, executors, msg.sender);
        timelock = address(timelockContract);

        // Step 2: Deploy Governor
        DGPGovernor governorContract = new DGPGovernor(token, timelockContract, votingDelay, votingPeriod, proposalThreshold);
        governor = address(governorContract);

        // Step 3: Deploy Treasury
        DGPTreasury treasuryContract = new DGPTreasury(governor);
        treasury = address(treasuryContract);

        // Step 4: Set up roles
        // Grant proposer role to the governor
        timelockContract.grantRole(timelockContract.PROPOSER_ROLE(), governor);
        // Grant executor role to the governor
        timelockContract.grantRole(timelockContract.EXECUTOR_ROLE(), governor);

        // Revoke deployer's proposer and admin roles
        timelockContract.revokeRole(timelockContract.PROPOSER_ROLE(), msg.sender);
        timelockContract.renounceRole(timelockContract.DEFAULT_ADMIN_ROLE(), msg.sender);

        emit DAOCreated(governor, timelock, treasury);
    }
}
