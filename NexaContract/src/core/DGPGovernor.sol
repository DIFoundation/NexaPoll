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
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract DGPGovernor is 
    Governor, 
    GovernorSettings, 
    GovernorCountingSimple, 
    GovernorVotes, 
    GovernorTimelockControl 
{
    uint256 private _quorumPercentage; // e.g., 10 for 10%

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
    uint256 quorumPercentage_
    )
        Governor("Decentralized Governance Protocol Governor")
        GovernorSettings(SafeCast.toUint48(_votingDelay), SafeCast.toUint32(_votingPeriod), _proposalThreshold)
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
    {
        require(_quorumPercentage > 0 && _quorumPercentage <= 100, "Invalid quorum percentage");
    _quorumPercentage = quorumPercentage_;
    }

    /**
     * @dev Calculate quorum as a percentage of total supply at a given block
     * @param blockNumber The block number to query
     * @return The number of votes required for quorum
     */
    function quorum(uint256 blockNumber) public view override returns (uint256) {
        uint256 totalSupply = token().getPastTotalSupply(blockNumber);
        return (totalSupply * _quorumPercentage) / 100;
    }

    /**
     * @dev Get the current quorum percentage
     */
    function quorumPercentage() public view returns (uint256) {
        return _quorumPercentage;
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

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}