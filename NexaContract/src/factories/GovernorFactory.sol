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
        address[] memory proposers = new address[](1);
        proposers[0] = msg.sender;
        address[] memory executors = new address[](1);
        executors[0] = address(governorContract); // Only governor can execute

        // Grant proposer role to governor
        timelockContract.grantRole(timelockContract.PROPOSER_ROLE(), address(governorContract));
        // Revoke admin role from deployer
        timelockContract.renounceRole(timelockContract.TIMELOCK_ADMIN_ROLE(), msg.sender);


        emit DAOCreated(address(governorContract), address(timelockContract), address(treasuryContract));
        return (address(governorContract), address(timelockContract), address(treasuryContract));
    }
}
