// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// DGPTimelockController.sol (Non-Upgradeable Clone Pattern)
// ============================================
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract DGPTimelockController is TimelockController {
    bool private _initialized;

    constructor() TimelockController(1 days, new address[](0), new address[](0), address(0)) {}

    function initialize(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) external {
        require(!_initialized, "Already initialized");
        require(minDelay >= 1 days, "Delay too short for security");
        
        _initialized = true;

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        
        for (uint256 i = 0; i < proposers.length; i++) {
            _grantRole(PROPOSER_ROLE, proposers[i]);
            _grantRole(CANCELLER_ROLE, proposers[i]);
        }
        
        for (uint256 i = 0; i < executors.length; i++) {
            _grantRole(EXECUTOR_ROLE, executors[i]);
        }
    }
}