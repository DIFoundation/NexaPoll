// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// DGPGovernor.sol (Non-Upgradeable Clone Pattern)
// ============================================
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DGPGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorTimelockControl,
    Ownable
{
    bool private _initialized;
    uint256 private _quorumPercentage;
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
    uint256 public constant MAX_VOTING_POWER = 10_000 * 1e18;

    // Empty constructor - implementation contract is never used directly
    constructor(IVotes _token, TimelockController _timelock)
        Governor("DGPGovernor")
        GovernorSettings(1 /* 1 block */, 100 /* 100 blocks */, 0)
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
        Ownable(msg.sender)
    {}

    function initialize(
        IVotes _token,
        TimelockController _timelock,
        uint32 _votingDelay,
        uint32 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 quorumPercentage_,
        address _admin
    ) external {
        require(!_initialized, "Already initialized");
        require(quorumPercentage_ > 0 && quorumPercentage_ <= 100, "Invalid quorum percentage");
        require(address(_token) != address(0), "Invalid token address");
        require(address(_timelock) != address(0), "Invalid timelock address");
        
        _initialized = true;
        votingToken = _token;
        _quorumPercentage = quorumPercentage_;
        
        // Initialize parent contracts
        _setVotingDelay(_votingDelay);
        _setVotingPeriod(_votingPeriod);
        _setProposalThreshold(_proposalThreshold);
        
        // Transfer ownership to admin
        _transferOwnership(_admin);
    }

    function addMember(address member, uint256 votingPower) external onlyOwner {
        require(member != address(0), "Invalid member");
        require(!_isMember[member], "Already a member");
        _isMember[member] = true;
        _members.push(member);
        _mintVotingPower(member, votingPower);
        emit MemberAdded(member, votingPower);
    }

    function batchAddMembers(address[] calldata members, uint256[] calldata votingPowers) external onlyOwner {
        require(members.length == votingPowers.length, "Length mismatch");
        for (uint256 i = 0; i < members.length; i++) {
            if (!_isMember[members[i]]) {
                _isMember[members[i]] = true;
                _members.push(members[i]);
                _mintVotingPower(members[i], votingPowers[i]);
                emit MemberAdded(members[i], votingPowers[i]);
            }
        }
    }

    function removeMember(address member) external onlyOwner {
        require(_isMember[member], "Not a member");
        _isMember[member] = false;
        for (uint256 i = 0; i < _members.length; i++) {
            if (_members[i] == member) {
                _members[i] = _members[_members.length - 1];
                _members.pop();
                break;
            }
        }
        emit MemberRemoved(member);
    }

    function listMembers() external view returns (address[] memory) {
        return _members;
    }

    function _mintVotingPower(address to, uint256 amount) internal {
        (bool success, ) = address(votingToken).call(
            abi.encodeWithSignature("mint(address,uint256)", to, amount)
        );
        if (!success) {
            for (uint256 i = 0; i < amount; i++) {
                (bool nftSuccess, ) = address(votingToken).call(
                    abi.encodeWithSignature("mint(address)", to)
                );
                require(nftSuccess, "ERC721 mint failed");
            }
        }
    }

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

    function getProposalMetadata(uint256 proposalId) external view returns (ProposalMetadata memory) {
        ProposalMetadata memory meta = _proposalMetadata[proposalId];
        (uint256 forVotes, uint256 againstVotes, ) = proposalVotes(proposalId);
        meta.votesFor = forVotes;
        meta.votesAgainst = againstVotes;
        uint256 totalSupply = token().getPastTotalSupply(proposalSnapshot(proposalId));
        meta.quorumReachedPct = totalSupply > 0 ? (forVotes * 100) / totalSupply : 0;
        
        ProposalState state_ = state(proposalId);
        if (state_ == ProposalState.Pending) meta.status = ProposalStatus.Draft;
        else if (state_ == ProposalState.Active) meta.status = ProposalStatus.Active;
        else if (state_ == ProposalState.Succeeded) meta.status = ProposalStatus.Passed;
        else if (state_ == ProposalState.Defeated) meta.status = ProposalStatus.Failed;
        else if (state_ == ProposalState.Queued) meta.status = ProposalStatus.Queued;
        else if (state_ == ProposalState.Executed) meta.status = ProposalStatus.Executed;
        return meta;
    }

    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        require(msg.sender != _proposalMetadata[proposalId].proposer, "Creator cannot vote");
        return super.castVote(proposalId, support);
    }

    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) public override returns (uint256) {
        require(msg.sender != _proposalMetadata[proposalId].proposer, "Creator cannot vote");
        return super.castVoteWithReason(proposalId, support, reason);
    }

    function mintVotingPower(address to, uint256 amount) external onlyOwner {
        require(_isMember[to], "Not a member");
        try IERC20(address(votingToken)).balanceOf(to) returns (uint256 currentBalance) {
            require(currentBalance + amount <= MAX_VOTING_POWER, "Exceeds allowed limit");
        } catch {}
        _mintVotingPower(to, amount);
    }

    function quorum(uint256 blockNumber) public view override returns (uint256) {
        uint256 totalSupply = token().getPastTotalSupply(blockNumber);
        return (totalSupply * _quorumPercentage) / 100;
    }

    function quorumPercentage() public view returns (uint256) {
        return _quorumPercentage;
    }

    // Override required functions
    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (bool) {
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

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
}