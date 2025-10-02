// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IGovernor
 * @dev Standard interface for Governor contracts.
 * This extends OpenZeppelin's IGovernor with additional utility functions.
 */
import "@openzeppelin/contracts/governance/IGovernor.sol";

/**
 * @notice Extended interface for DGP Governor contracts
 * @dev Includes standard Governor functions plus custom utilities
 */
interface IDGPGovernor is IGovernor {
    /**
     * @dev Returns the percentage of total supply required for quorum
     */
    function quorumPercentage() external view returns (uint256);

    /**
     * @dev Returns the voting token used by this governor
     */
    function token() external view returns (address);

    /**
     * @dev Returns the timelock controller address
     */
    function timelock() external view returns (address);
}