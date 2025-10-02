// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DGPTimelockController
 * @dev Enforces a mandatory delay before executing successful proposals.
 * Protects against malicious instant actions by giving community time to react.
 */
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract DGPTimelockController is TimelockController {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    )
        TimelockController(minDelay, proposers, executors)
    {}

}
