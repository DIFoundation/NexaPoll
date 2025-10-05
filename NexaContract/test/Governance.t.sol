// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import {Test, console} from "forge-std/Test.sol";

// // Import the main contracts
// import {GovernorFactory} from "../src/factories/GovernorFactory.sol";
// import {ERC20VotingPower} from "../src/core/voting/ERC20VotingPower.sol";
// import {ERC721VotingPower} from "../src/core/voting/ERC721VotingPower.sol";
// import {DGPGovernor} from "../src/core/DGPGovernor.sol";
// import {DGPTimelockController} from "../src/core/DGPTimelockController.sol";
// import {DGPTreasury} from "../src/core/DGPTreasury.sol";

// // Import OpenZeppelin interfaces
// import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
// import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";
// import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

// contract GovernanceTest is Test {
//     GovernorFactory public governorFactory;
    
//     // Test tokens
//     ERC20VotingPower public erc20Token;
//     ERC721VotingPower public erc721Token;
    
//     // Test addresses
//     address public alice = address(0x1);
//     address public bob = address(0x2);
//     address public charlie = address(0x3);
    
//     // DAO parameters
//     uint256 votingDelay = 1; // 1 block
//     uint256 votingPeriod = 50400; // ~1 week in blocks
//     uint256 proposalThreshold = 100e18; // 100 tokens
//     uint256 timelockDelay = 1 days;
//     uint256 quorumPercentage = 51; // 51%
    
//     function setUp() public {
//         // Deploy the factory
//         governorFactory = new GovernorFactory();
        
//         // Deploy ERC20 voting token with initial supply
//         erc20Token = new ERC20VotingPower(
//             "Governance Token",
//             "GOV",
//             1000000e18, // 1M initial supply
//             0 // unlimited max supply
//         );
        
//         // Deploy ERC721 voting token
//         erc721Token = new ERC721VotingPower(
//             "Governance NFT",
//             "GNFT",
//             10000, // max supply
//             "https://example.com/nft/"
//         );
        
//         // Setup test users with tokens
//         erc20Token.mint(alice, 500000e18);
//         erc20Token.mint(bob, 300000e18);
//         erc20Token.mint(charlie, 200000e18);
        
//         // Delegate voting power to themselves (required for voting)
//         vm.prank(alice);
//         erc20Token.delegate(alice);
//         vm.prank(bob);
//         erc20Token.delegate(bob);
//         vm.prank(charlie);
//         erc20Token.delegate(charlie);
//     }
    
//     function test_CreateDAO_ERC20() public {
//         assertEq(governorFactory.getDaoCount(), 0, "DAO count should be 0");
//         assertEq(governorFactory.getDaosByCreator(address(this)).length, 0, "DAOs by creator should be empty");
        
//         // Create a new DAO with ERC20 token
//         (address governor, address timelock, address treasury) = governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             quorumPercentage
//         );
        
//         assertEq(governorFactory.getDaoCount(), 1, "DAO count should be 1");
//         assertEq(governorFactory.getDaosByCreator(address(this)).length, 1, "DAOs by creator should be 1");
        
//         // Verify the DAO was created with correct parameters
//         GovernorFactory.DAOConfig memory dao = governorFactory.getDao(0);
//         assertEq(dao.governor, governor, "Governor address mismatch");
//         assertEq(dao.timelock, timelock, "Timelock address mismatch");
//         assertEq(dao.treasury, treasury, "Treasury address mismatch");
//         assertEq(dao.token, address(erc20Token), "Token address mismatch");
//         assertEq(dao.creator, address(this), "Creator address mismatch");
//         assertEq(dao.createdAt, block.timestamp, "Created timestamp mismatch");
        
//         // Verify the contracts are properly deployed
//         assertTrue(governor != address(0), "Governor not deployed");
//         assertTrue(timelock != address(0), "Timelock not deployed");
//         assertTrue(treasury != address(0), "Treasury not deployed");
//     }
    
//     function test_CreateDAO_ERC721() public {
//         // Create a new DAO with ERC721 token
//         (address governor, address timelock, address treasury) = governorFactory.createDAO(
//             IVotes(address(erc721Token)),
//             votingDelay,
//             votingPeriod,
//             1, // proposal threshold (1 NFT)
//             timelockDelay,
//             quorumPercentage
//         );
        
//         // Verify the DAO was created
//         GovernorFactory.DAOConfig memory dao = governorFactory.getDao(0);
//         assertEq(dao.token, address(erc721Token), "ERC721 token address mismatch");
//         assertTrue(governor != address(0), "Governor not deployed");
//     }
    
//     function test_MultipleDAOs() public {
//         // Create first DAO
//         governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             quorumPercentage
//         );
        
//         // Create another ERC20 token for second DAO
//         ERC20VotingPower secondToken = new ERC20VotingPower(
//             "Second Token",
//             "SEC",
//             1000000e18,
//             0
//         );
        
//         // Create second DAO
//         governorFactory.createDAO(
//             IVotes(address(secondToken)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             quorumPercentage
//         );
        
//         assertEq(governorFactory.getDaoCount(), 2, "Should have 2 DAOs");
//         assertEq(governorFactory.getDaosByCreator(address(this)).length, 2, "Creator should have 2 DAOs");
//     }
    
//     function test_RevertWhen_InvalidTimelockDelay() public {
//         // Should revert with timelock delay < 1 day
//         vm.expectRevert("Timelock delay too short");
//         governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             1 hours, // Less than 1 day
//             quorumPercentage
//         );
//     }
    
//     function test_RevertWhen_InvalidQuorum() public {
//         // Should revert with quorum > 100
//         vm.expectRevert("Invalid quorum percentage");
//         governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             101 // > 100%
//         );
        
//         // Should revert with quorum = 0
//         vm.expectRevert("Invalid quorum percentage");
//         governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             0 // 0%
//         );
//     }
    
//     function test_GovernorConfiguration() public {
//         // Create a DAO
//         (address governorAddr, , ) = governorFactory.createDAO(
//             IVotes(address(erc20Token)),
//             votingDelay,
//             votingPeriod,
//             proposalThreshold,
//             timelockDelay,
//             quorumPercentage
//         );
        
//         DGPGovernor governor = DGPGovernor(payable(governorAddr));
        
//         // Verify governor settings
//         assertEq(governor.votingDelay(), votingDelay, "Voting delay mismatch");
//         assertEq(governor.votingPeriod(), votingPeriod, "Voting period mismatch");
//         assertEq(governor.proposalThreshold(), proposalThreshold, "Proposal threshold mismatch");
//         assertEq(address(governor.token()), address(erc20Token), "Token mismatch");
//     }
// }