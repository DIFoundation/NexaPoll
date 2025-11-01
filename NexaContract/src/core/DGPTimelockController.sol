// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title DGPTimelockController
 * @dev Clonable timelock controller for EIP-1167 factories.
 */
contract DGPTimelockController is TimelockController, Initializable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() 
        TimelockController(0, new address[](0), new address[](0), msg.sender) 
    {
        _disableInitializers();
    }

    /**
     * @dev Initializes a clone instance after deployment.
     * @param minDelay Minimum delay for operations
     * @param proposers Array of addresses that can propose operations
     * @param executors Array of addresses that can execute operations
     * @param admin Address of the admin that can manage the timelock
     */
    function initialize(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) external initializer {
        require(minDelay >= 1 days, "Delay too short for security");
        require(proposers.length > 0, "At least one proposer required");
        require(executors.length > 0, "At least one executor required");
        require(admin != address(0), "Invalid admin address");
        
        // Initialize the TimelockController
        __TimelockController_init(minDelay, proposers, executors, admin);
    }

    // Helper for internal OZ init (since their base doesn’t provide one)
    function __TimelockController_init(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) internal {
        // Reinitialize state variables (mimic constructor)
        _setRoleAdmin(PROPOSER_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(EXECUTOR_ROLE, TIMELOCK_ADMIN_ROLE);
        _setRoleAdmin(CANCELLER_ROLE, TIMELOCK_ADMIN_ROLE);
        _grantRole(TIMELOCK_ADMIN_ROLE, admin);
        _updateDelay(minDelay);

        for (uint256 i = 0; i < proposers.length; ++i) {
            _grantRole(PROPOSER_ROLE, proposers[i]);
        }
        for (uint256 i = 0; i < executors.length; ++i) {
            _grantRole(EXECUTOR_ROLE, executors[i]);
        }
    }
}
