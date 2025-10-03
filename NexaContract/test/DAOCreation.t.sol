// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";
import {DGPGovernor} from "../src/core/DGPGovernor.sol";
import {DGPTimelockController} from "../src/core/DGPTimelockController.sol";
import {DGPTreasury} from "../src/core/DGPTreasury.sol";
import {ERC20VotingPower} from "../src/core/voting/ERC20VotingPower.sol";
import {ERC721VotingPower} from "../src/core/voting/ERC721VotingPower.sol";

contract DAOCreationTest is Test {
    GovernorFactory public governorFactory;
    
    // Test addresses
    address public deployer = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);
    
    // DAO parameters
    string public constant DAO_NAME = "Test DAO";
    string public constant TOKEN_NAME = "Test Token";
    string public constant TOKEN_SYMBOL = "TST";
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 1e18; // 1M tokens
    uint256 public constant VOTING_DELAY = 1; // 1 block
    uint256 public constant VOTING_PERIOD = 40_320; // ~7 days in blocks
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 1e18; // 1000 tokens
    uint256 public constant TIMELOCK_DELAY = 1 days;
    uint256 public constant QUORUM_PERCENTAGE = 4; // 4%

    function setUp() public {
        // Set deployer as the sender for all transactions
        vm.startPrank(deployer);
        
        // Deploy the factory
        governorFactory = new GovernorFactory();
        
        vm.stopPrank();
    }
    
    function test_CreateDAO_WithERC20Token() public {
        vm.startPrank(deployer);
        
        // Define expected values
        uint256 expectedDaoId = 0;
        
        // Expect the DAOCreated event
        vm.expectEmit(true, true, true, true);
        emit GovernorFactory.DAOCreated(
            address(0), // Will be checked separately
            address(0), // Will be checked separately
            address(0), // Will be checked separately
            address(0), // Will be checked separately
            GovernorFactory.TokenType.ERC20,
            deployer,
            expectedDaoId
        );
        
        // Create DAO with ERC20 token
        (address governor, address timelock, address treasury) = governorFactory.createDAO(
            DAO_NAME,
            TOKEN_NAME,
            TOKEN_SYMBOL,
            TokenType.ERC20,
            INITIAL_SUPPLY,
            VOTING_DELAY,
            VOTING_PERIOD,
            PROPOSAL_THRESHOLD,
            TIMELOCK_DELAY,
            QUORUM_PERCENTAGE
        );
        
        // Verify returned addresses are valid
        assertTrue(governor != address(0), "Invalid governor address");
        assertTrue(timelock != address(0), "Invalid timelock address");
        assertTrue(treasury != address(0), "Invalid treasury address");
        
        // Verify token is an ERC20 token
        ERC20VotingPower erc20Token = ERC20VotingPower(token);
        assertEq(erc20Token.name(), TOKEN_NAME, "Incorrect token name");
        assertEq(erc20Token.symbol(), TOKEN_SYMBOL, "Incorrect token symbol");
        assertEq(erc20Token.balanceOf(deployer), INITIAL_SUPPLY, "Incorrect initial balance");
        
        // Verify DAO configuration
        (address daoGovernor, address daoTimelock, address daoTreasury, address daoToken, 
         TokenType tokenType, address creator, uint256 createdAt) = 
            governorFactory.daos(expectedDaoId);
            
        assertEq(daoGovernor, governor, "Incorrect governor in storage");
        assertEq(daoTimelock, timelock, "Incorrect timelock in storage");
        assertEq(daoTreasury, treasury, "Incorrect treasury in storage");
        assertEq(address(daoToken), address(erc20Token), "Incorrect token in storage");
        assertEq(uint256(tokenType), uint256(TokenType.ERC20), "Incorrect token type");
        assertEq(creator, deployer, "Incorrect creator in storage");
        assertTrue(createdAt > 0, "Invalid creation timestamp");
        
        // Verify admin setup
        assertTrue(governorFactory.isDaoAdmin(governor, deployer), "Creator should be admin");
        
        // Verify token minter role
        assertTrue(erc20Token.hasRole(keccak256("MINTER_ROLE"), deployer), "Creator should have minter role");
        
        vm.stopPrank();
    }
    
    // function test_CreateDAO_WithERC721Token() public {
    //     vm.startPrank(deployer);
        
    //     // Define expected values
    //     uint256 expectedDaoId = 0;
    //     uint256 maxSupply = 1000; // Limited supply for ERC721
        
    //     // Expect the DAOCreated event
    //     vm.expectEmit(true, true, true, true);
    //     emit DAOCreated(
    //         address(0), // Will be checked separately
    //         address(0), // Will be checked separately
    //         address(0), // Will be checked separately
    //         address(0), // Will be checked separately
    //         GovernorFactory.TokenType.ERC721,
    //         deployer,
    //         expectedDaoId
    //     );
        
    //     // Create DAO with ERC721 token
    //     (address governor, address timelock, address treasury, address token) = governorFactory.createDAO(
    //         DAO_NAME,
    //         TOKEN_NAME,
    //         TOKEN_SYMBOL,
    //         GovernorFactory.TokenType.ERC721,
    //         maxSupply, // Max supply for ERC721
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         1, // 1 NFT needed to propose
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Verify returned addresses are valid
    //     assertTrue(governor != address(0), "Invalid governor address");
    //     assertTrue(timelock != address(0), "Invalid timelock address");
    //     assertTrue(treasury != address(0), "Invalid treasury address");
    //     assertTrue(token != address(0), "Invalid token address");
        
    //     // Verify token is an ERC721 token
    //     ERC721VotingPower erc721Token = ERC721VotingPower(token);
    //     assertEq(erc721Token.name(), TOKEN_NAME, "Incorrect token name");
    //     assertEq(erc721Token.symbol(), TOKEN_SYMBOL, "Incorrect token symbol");
        
    //     // Verify the creator received the first token
    //     assertEq(erc721Token.balanceOf(deployer), 1, "Creator should have received 1 NFT");
        
    //     // Verify DAO configuration
    //     (address daoGovernor, address daoTimelock, address daoTreasury, address daoToken, 
    //      GovernorFactory.TokenType tokenType, address creator, uint256 createdAt) = 
    //         governorFactory.daos(expectedDaoId);
            
    //     assertEq(daoGovernor, governor, "Incorrect governor in storage");
    //     assertEq(daoTimelock, timelock, "Incorrect timelock in storage");
    //     assertEq(daoTreasury, treasury, "Incorrect treasury in storage");
    //     assertEq(daoToken, token, "Incorrect token in storage");
    //     assertEq(uint256(tokenType), uint256(GovernorFactory.TokenType.ERC721), "Incorrect token type");
    //     assertEq(creator, deployer, "Incorrect creator in storage");
    //     assertTrue(createdAt > 0, "Invalid creation timestamp");
        
    //     // Verify admin setup
    //     assertTrue(governorFactory.isDaoAdmin(governor, deployer), "Creator should be admin");
        
    //     // Verify token minter role
    //     assertTrue(erc721Token.hasRole(keccak256("MINTER_ROLE"), deployer), "Creator should have minter role");
        
    //     vm.stopPrank();
    // }
    
    // function test_RevertWhen_InvalidParameters() public {
    //     vm.startPrank(deployer);
        
    //     // Test empty DAO name
    //     vm.expectRevert("DAO name required");
    //     governorFactory.createDAO(
    //         "", // Empty name
    //         TOKEN_NAME,
    //         TOKEN_SYMBOL,
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Test empty token name
    //     vm.expectRevert("Token name required");
    //     governorFactory.createDAO(
    //         DAO_NAME,
    //         "", // Empty token name
    //         TOKEN_SYMBOL,
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Test empty token symbol
    //     vm.expectRevert("Token symbol required");
    //     governorFactory.createDAO(
    //         DAO_NAME,
    //         TOKEN_NAME,
    //         "", // Empty token symbol
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Test invalid timelock delay
    //     vm.expectRevert("Timelock delay too short");
    //     governorFactory.createDAO(
    //         DAO_NAME,
    //         TOKEN_NAME,
    //         TOKEN_SYMBOL,
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         23 hours, // Less than 1 day
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Test invalid quorum percentage
    //     vm.expectRevert("Invalid quorum percentage");
    //     governorFactory.createDAO(
    //         DAO_NAME,
    //         TOKEN_NAME,
    //         TOKEN_SYMBOL,
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         TIMELOCK_DELAY,
    //         101 // More than 100%
    //     );
        
    //     vm.stopPrank();
    // }
    
    // function test_MultipleDAOCreation() public {
    //     vm.startPrank(deployer);
        
    //     // Create first DAO
    //     (address governor1, , , ) = governorFactory.createDAO(
    //         "DAO 1",
    //         "Token 1",
    //         "TKN1",
    //         GovernorFactory.TokenType.ERC20,
    //         INITIAL_SUPPLY,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         PROPOSAL_THRESHOLD,
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Create second DAO
    //     (address governor2, , , ) = governorFactory.createDAO(
    //         "DAO 2",
    //         "Token 2",
    //         "TKN2",
    //         GovernorFactory.TokenType.ERC721,
    //         1000, // Max supply
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         1, // 1 NFT needed to propose
    //         TIMELOCK_DELAY,
    //         QUORUM_PERCENTAGE
    //     );
        
    //     // Verify both DAOs exist and have correct IDs
    //     (address dao1Governor, , , , , , ) = governorFactory.daos(0);
    //     (address dao2Governor, , , , , , ) = governorFactory.daos(1);
        
    //     assertEq(dao1Governor, governor1, "First DAO ID mismatch");
    //     assertEq(dao2Governor, governor2, "Second DAO ID mismatch");
        
    //     // Verify creator's DAO list
    //     address[] memory creatorDaos = governorFactory.daosByCreator(deployer);
    //     assertEq(creatorDaos.length, 2, "Incorrect number of DAOs for creator");
    //     assertEq(creatorDaos[0], governor1, "First DAO not in creator's list");
    //     assertEq(creatorDaos[1], governor2, "Second DAO not in creator's list");
        
    //     vm.stopPrank();
    // }
}
