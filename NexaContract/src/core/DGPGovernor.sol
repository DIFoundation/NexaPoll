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

import "@openzeppelin/contracts/access/Ownable.sol";

contract DGPGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorTimelockControl,
    Ownable
{
    uint256 private _quorumPercentage; // e.g., 10 for 10%

    // DAO member management
    mapping(address => bool) private _isMember;
    address[] private _members;

    event MemberAdded(address indexed member, uint256 votingPower);
    event MemberRemoved(address indexed member);

    enum ProposalStatus { Draft, Active, Passed, Failed, Queued, Executed }

    struct ProposalMetadata {
        string title;
        string description;
        string proposalType;
        string proposedSolution;
        string rationale;
        string expectedOutcomes;
        string timeline;
        string budget;
        address proposer;
        uint256 timestamp;
        ProposalStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 quorumReachedPct;
    }

    mapping(uint256 => ProposalMetadata) private _proposalMetadata;

    IVotes public votingToken;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 quorumPercentage_,
        address admin
    )
        Governor("Decentralized Governance Protocol Governor")
        GovernorSettings(
            SafeCast.toUint48(_votingDelay),
            SafeCast.toUint32(_votingPeriod),
            _proposalThreshold
        )
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
        Ownable()
    {
        require(
            quorumPercentage_ > 0 && quorumPercentage_ <= 100,
            "Invalid quorum percentage"
        );
        _quorumPercentage = quorumPercentage_;
        votingToken = _token;
        _transferOwnership(admin);
    }

    /**
     * @dev Add a new DAO member and mint voting power to them (onlyOwner)
     * @param member Address to add
     * @param votingPower Amount of voting power to mint (ERC20: tokens, ERC721: NFTs)
     */
    function addMember(address member, uint256 votingPower) external onlyOwner {
        require(member != address(0), "Invalid member");
        require(!_isMember[member], "Already a member");
        _isMember[member] = true;
        _members.push(member);
        // Mint voting power if Governor has MINTER_ROLE
        _mintVotingPower(member, votingPower);
        emit MemberAdded(member, votingPower);
    }

    /**
     * @dev Batch add members and mint voting power (onlyOwner)
     */
    function batchAddMembers(address[] calldata members, uint256[] calldata votingPowers) external onlyOwner {
        require(members.length == votingPowers.length, "Length mismatch");
        for (uint256 i = 0; i < members.length; i++) {
            addMember(members[i], votingPowers[i]);
        }
    }

    /**
     * @dev Remove a DAO member (onlyOwner)
     */
    function removeMember(address member) external onlyOwner {
        require(_isMember[member], "Not a member");
        _isMember[member] = false;
        // Remove from _members array
        for (uint256 i = 0; i < _members.length; i++) {
            if (_members[i] == member) {
                _members[i] = _members[_members.length - 1];
                _members.pop();
                break;
            }
        }
        emit MemberRemoved(member);
    }

    /**
     * @dev List all DAO members
     */
    function listMembers() external view returns (address[] memory) {
        return _members;
    }

    /**
     * @dev Internal mint voting power logic (ERC20 or ERC721)
     */
    function _mintVotingPower(address to, uint256 amount) internal {
        // Try ERC20 mint
        (bool success, ) = address(votingToken).call(
            abi.encodeWithSignature("mint(address,uint256)", to, amount)
        );
        if (!success) {
            // Try ERC721 mint (amount = number of NFTs)
            for (uint256 i = 0; i < amount; i++) {
                (bool nftSuccess, ) = address(votingToken).call(
                    abi.encodeWithSignature("mint(address)", to)
                );
                require(nftSuccess, "ERC721 mint failed");
            }
        }
    }

    /**
     * @dev Create a proposal with custom metadata (title, description)
     * @param targets List of target addresses for calls
     * @param values List of ETH values for calls
     * @param calldatas List of calldata for calls
     * @param title Title of the proposal
     * @param description Description of the proposal
     * @return proposalId The ID of the created proposal
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory title,
        string memory description,
        string memory proposalType,
        string memory proposedSolution,
        string memory rationale,
        string memory expectedOutcomes,
        string memory timeline,
        string memory budget
    ) public returns (uint256 proposalId) {
        // Compose a description string for Governor compatibility
        string memory fullDescription = string(abi.encodePacked(title, "\n", description));
        proposalId = propose(targets, values, calldatas, fullDescription);
        _proposalMetadata[proposalId] = ProposalMetadata({
            title: title,
            description: description,
            proposalType: proposalType,
            proposedSolution: proposedSolution,
            rationale: rationale,
            expectedOutcomes: expectedOutcomes,
            timeline: timeline,
            budget: budget,
            proposer: msg.sender,
            timestamp: block.timestamp,
            status: ProposalStatus.Draft,
            votesFor: 0,
            votesAgainst: 0,
            quorumReachedPct: 0
        });
    }

    // Update proposal status in metadata based on Governor state
    function getProposalMetadata(uint256 proposalId) external view returns (ProposalMetadata memory) {
        ProposalMetadata memory meta = _proposalMetadata[proposalId];
        // Update votes and quorum reached percentage dynamically
        (uint256 forVotes, uint256 againstVotes, ) = proposalVotes(proposalId);
        meta.votesFor = forVotes;
        meta.votesAgainst = againstVotes;
        uint256 totalSupply = token().getPastTotalSupply(proposalSnapshot(proposalId));
        meta.quorumReachedPct = totalSupply > 0 ? (forVotes * 100) / totalSupply : 0;
        // Update status
        ProposalState state_ = state(proposalId);
        if (state_ == ProposalState.Pending) meta.status = ProposalStatus.Draft;
        else if (state_ == ProposalState.Active) meta.status = ProposalStatus.Active;
        else if (state_ == ProposalState.Succeeded) meta.status = ProposalStatus.Passed;
        else if (state_ == ProposalState.Defeated) meta.status = ProposalStatus.Failed;
        else if (state_ == ProposalState.Queued) meta.status = ProposalStatus.Queued;
        else if (state_ == ProposalState.Executed) meta.status = ProposalStatus.Executed;
        return meta;
    }

    // Prevent proposal creator from voting on their own proposal
    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        require(msg.sender != _proposalMetadata[proposalId].proposer, "Creator cannot vote");
        return super.castVote(proposalId, support);
    }

    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) public override returns (uint256) {
        require(msg.sender != _proposalMetadata[proposalId].proposer, "Creator cannot vote");
        return super.castVoteWithReason(proposalId, support, reason);
    }

    // Admin-only mint voting power to a member (in case they run out)
    function mintVotingPower(address to, uint256 amount) external onlyOwner {
        require(_isMember[to], "Not a member");
        _mintVotingPower(to, amount);
    }

    /**
     * @dev Get proposal metadata by proposalId
     */
    function getProposalMetadata(uint256 proposalId) external view returns (ProposalMetadata memory) {
        ProposalMetadata memory meta = _proposalMetadata[proposalId];
        // Update votes and quorum reached percentage dynamically
        (uint256 forVotes, uint256 againstVotes, ) = proposalVotes(proposalId);
        meta.votesFor = forVotes;
        meta.votesAgainst = againstVotes;
        uint256 totalSupply = token().getPastTotalSupply(proposalSnapshot(proposalId));
        meta.quorumReachedPct = totalSupply > 0 ? (forVotes * 100) / totalSupply : 0;
        return meta;
    }

    /**
     * @dev Calculate quorum as a percentage of total supply at a given block
     * @param blockNumber The block number to query
     * @return The number of votes required for quorum
     */
    function quorum(
        uint256 blockNumber
    ) public view override returns (uint256) {
        uint256 totalSupply = token().getPastTotalSupply(blockNumber);
        return (totalSupply * _quorumPercentage) / 100;
    }

    /**
     * @dev Get the current quorum percentage
     */
    function quorumPercentage() public view returns (uint256) {
        return _quorumPercentage;
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    // Resolve multiple inheritance
    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
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
