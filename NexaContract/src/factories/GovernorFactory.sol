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
        address ;
        proposers[0] = msg.sender;
        address ;
        executors[0] = address(0);

        DGPTimelockController timelockContract = new DGPTimelockController(timelockDelay, proposers, executors);
        DGPGovernor governorContract = new DGPGovernor(token, timelockContract, votingDelay, votingPeriod, proposalThreshold);
        DGPTreasury treasuryContract = new DGPTreasury(address(governorContract));

        emit DAOCreated(address(governorContract), address(timelockContract), address(treasuryContract));
        return (address(governorContract), address(timelockContract), address(treasuryContract));
    }
}
