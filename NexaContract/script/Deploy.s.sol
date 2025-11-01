// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";

contract DeployFactory is Script {
    function run() public {
        vm.startBroadcast();
        GovernorFactory factory = new GovernorFactory(
            address(0),
            address(0),
            address(0)
        );

        console2.log("GovernorFactory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}
