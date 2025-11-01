// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {Script, console2} from "forge-std/Script.sol";
// import {GovernorFactory} from "../src/factories/GovernorFactory.sol";

// contract DeployGovernorFactory is Script {
//     function run() public {
//         console2.log("Starting GovernorFactory deployment...");
//         console2.log("Network Chain ID:", block.chainid);

//         // Load the deployer key from env or broadcast context
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//         address deployer = vm.addr(deployerPrivateKey);
//         console2.log("Deployer address:", deployer);

//         // Begin broadcasting transactions
//         vm.startBroadcast(deployerPrivateKey);

//         // Deploy the GovernorFactory
//         GovernorFactory factory = new GovernorFactory();

//         // Verify deployment success
//         uint256 codeSize = address(factory).code.length;
//         require(codeSize > 0, "Deployment failed: no code at deployed address");

//         console2.log("GovernorFactory successfully deployed!");
//         console2.log("Contract address:", address(factory));
//         console2.log("Deployer:", deployer);
//         console2.log("Code size:", codeSize, "bytes");

//         vm.stopBroadcast();
//     }
// }
