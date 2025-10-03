// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TestInterfaces
 * @dev Reference file containing all interfaces and types needed for testing NexaPoll contracts
 * Import this file in your tests to get access to all necessary types
 */

// ============================================================================
// OPENZEPPELIN INTERFACES (Available via imports)
// ============================================================================

// From: @openzeppelin/contracts/governance/utils/IVotes.sol
// interface IVotes {
//     function getVotes(address account) external view returns (uint256);
//     function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
//     function getPastTotalSupply(uint256 timepoint) external view returns (uint256);
//     function delegates(address account) external view returns (address);
//     function delegate(address delegatee) external;
//     function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external;
// }

// From: @openzeppelin/contracts/governance/IGovernor.sol
// interface IGovernor {
//     enum ProposalState { Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired, Executed }
//     
//     function propose(
//         address[] memory targets,
//         uint256[] memory values,
//         bytes[] memory calldatas,
//         string memory description
//     ) external returns (uint256 proposalId);
//     
//     function execute(
//         address[] memory targets,
//         uint256[] memory values,
//         bytes[] memory calldatas,
//         bytes32 descriptionHash
//     ) external payable returns (uint256 proposalId);
//     
//     function castVote(uint256 proposalId, uint8 support) external returns (uint256 balance);
//     function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external returns (uint256 balance);
//     function castVoteBySig(uint256 proposalId, uint8 support, address voter, bytes memory signature) external returns (uint256 balance);
//     
//     function state(uint256 proposalId) external view returns (ProposalState);
//     function votingDelay() external view returns (uint256);
//     function votingPeriod() external view returns (uint256);
//     function proposalThreshold() external view returns (uint256);
// }

// ============================================================================
// CUSTOM INTERFACES
// ============================================================================

/**
 * @dev Interface for ERC20VotingPower contract
 */
interface IERC20VotingPower {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function maxSupply() external view returns (uint256);
    
    // From ERC20
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    // From IVotes
    function getVotes(address account) external view returns (uint256);
    function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
    function getPastTotalSupply(uint256 timepoint) external view returns (uint256);
    function delegates(address account) external view returns (address);
    function delegate(address delegatee) external;
}

/**
 * @dev Interface for ERC721VotingPower contract
 */
interface IERC721VotingPower {
    function mint(address to) external returns (uint256);
    function batchMint(address to, uint256 quantity) external;
    function burn(uint256 tokenId) external;
    function setBaseURI(string memory baseURI) external;
    function totalSupply() external view returns (uint256);
    function maxSupply() external view returns (uint256);
    
    // From ERC721
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    
    // From IVotes
    function getVotes(address account) external view returns (uint256);
    function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
    function delegates(address account) external view returns (address);
    function delegate(address delegatee) external;
}

/**
 * @dev Interface for DGPGovernor contract
 */
interface IDGPGovernor {
    function quorumPercentage() external view returns (uint256);
    function token() external view returns (address);
    function timelock() external view returns (address);
    
    // From IGovernor (key functions)
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);
    
    function castVote(uint256 proposalId, uint8 support) external returns (uint256);
    function state(uint256 proposalId) external view returns (uint8);
    function votingDelay() external view returns (uint256);
    function votingPeriod() external view returns (uint256);
    function proposalThreshold() external view returns (uint256);
    function quorum(uint256 timepoint) external view returns (uint256);
}

/**
 * @dev Interface for DGPTreasury contract
 */
interface IDGPTreasury {
    function controller() external view returns (address);
    function getBalance() external view returns (uint256);
    function getTokenBalance(address token) external view returns (uint256);
    
    function execute(
        address target,
        uint256 value,
        bytes memory data
    ) external returns (bytes memory);
    
    function executeToken(
        address token,
        address to,
        uint256 amount
    ) external returns (bool);
}

/**
 * @dev Interface for DGPTimelockController
 * Inherits from OpenZeppelin's TimelockController
 */
interface IDGPTimelockController {
    function PROPOSER_ROLE() external view returns (bytes32);
    function EXECUTOR_ROLE() external view returns (bytes32);
    function CANCELLER_ROLE() external view returns (bytes32);
    function DEFAULT_ADMIN_ROLE() external view returns (bytes32);
    
    function getMinDelay() external view returns (uint256);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
}

/**
 * @dev Struct for GovernorFactory DAO configuration
 */
struct DAOConfig {
    address governor;
    address timelock;
    address treasury;
    address token;
    address creator;
    uint256 createdAt;
}

/**
 * @dev Interface for GovernorFactory contract
 */
interface IGovernorFactory {
    function createDAO(
        address token, // Should be IVotes compatible
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 timelockDelay,
        uint256 quorumPercentage
    ) external returns (address governor, address timelock, address treasury);
    
    function getDaoCount() external view returns (uint256);
    function getDaosByCreator(address creator) external view returns (address[] memory);
    function getDao(uint256 daoId) external view returns (DAOConfig memory);
    function isDAO(address governor) external view returns (bool);
}

// ============================================================================
// HELPER CONSTANTS
// ============================================================================

/**
 * @dev Vote types for Governor proposals
 */
library VoteType {
    uint8 constant Against = 0;
    uint8 constant For = 1;
    uint8 constant Abstain = 2;
}

/**
 * @dev Proposal states
 */
library ProposalState {
    uint8 constant Pending = 0;
    uint8 constant Active = 1;
    uint8 constant Canceled = 2;
    uint8 constant Defeated = 3;
    uint8 constant Succeeded = 4;
    uint8 constant Queued = 5;
    uint8 constant Expired = 6;
    uint8 constant Executed = 7;
}
