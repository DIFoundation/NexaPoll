// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IVotingPower
 * @dev Standard interface for voting power tokens compatible with Governor contracts.
 * Implements the IVotes interface from OpenZeppelin.
 */
import "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @notice This interface extends IVotes to ensure compatibility with Governor contracts
 * @dev Any token used for governance must implement this interface
 */
interface IVotingPower is IVotes {
    /**
     * @dev Returns the name of the token
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals of the token (0 for NFTs, 18 for most ERC20s)
     */
    function decimals() external view returns (uint8);
}