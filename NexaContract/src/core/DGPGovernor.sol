// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DGPGovernor
 * @dev Core governance contract managing proposals, voting, and execution logic.
 * Inherits from OpenZeppelin's Governor contracts for security and modularity.
 * Lifecycle: Pending → Active → Succeeded/Defeated → Queued → Executed
 */
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract DGPGovernor is 
    Governor, 
    GovernorSettings, 
    GovernorCountingSimple, 
    GovernorVotes, 
    GovernorTimelockControl 
{
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold
    )
        Governor("Decentralized Governance Protocol Governor")
        GovernorSettings(_votingDelay, _votingPeriod, _proposalThreshold)
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
    {}

    // Override required functions from parent contracts
    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        // Example: 10% of total supply required
        return 100_000e18 / 10;
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    // Resolve multiple inheritance
    function state(uint256 proposalId) 
        public view override(Governor, GovernorTimelockControl) returns (ProposalState) 
    {
        return super.state(proposalId);
    }
}
