// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";

contract testCreateDAO is Test {
    GovernorFactory public governorFactory;

    address public Bob = address(0x1);
    address public Alice = address(0x2);

    function setUp() public {
        governorFactory = new GovernorFactory();
    }

    function testCheckFactoryDeployment() public view {
        assert(address(governorFactory) != address(0));

        assertEq(governorFactory.getDaoCount(), 0, "Initial DAO count should be zero");
        // assertFalse(governorFactory.getDao(1).exists, "DAO at index 1 should exist false");
        assertEq(governorFactory.getAllDaos().length, 0, "Zero DAO count");
        assertEq(governorFactory.getDaosByCreator(Bob).length, 0, "Bob should have zero DAOs");
    }

    function testCreatDAO() public {
        
        vm.deal(Bob, 100 ether);
        vm.deal(Alice, 100 ether);

        vm.startPrank(Bob);
        // Create a DAO with ERC20 token
        governorFactory.createDAO(
            "My First DAO",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            ""
        );

        vm.stopPrank();

        vm.startPrank(Alice);

        // Create another DAO with ERC721
          governorFactory.createDAO(
            "My Second DAO",
            "MKT2",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC721, // Token type
            "https://example.com/nft/"
        );

        vm.stopPrank();

        // Verify DAO creation
        assertEq(governorFactory.getDaoCount(), 2, "DAO count should be two");
        assertTrue(governorFactory.isDAO(address(governorFactory.getDao(0).governor)), "The created governor should be recognized as a DAO");
        assertTrue(governorFactory.isDAO(address(governorFactory.getDao(1).governor)), "The created governor should be recognized as a DAO");
        assertEq(governorFactory.getAllDaos().length, 2, "Two DAO should exist");
        assertEq(governorFactory.getDaosByCreator(Alice).length, 1, "Alice should have one DAO");
        assertEq(governorFactory.getDaosByCreator(Bob).length, 1, "Bob should have one DAO");
        // assertEq(governorFactory.getDaosByCreator(Bob).length, 2, "Bob should have two DAOs");


        // Log DAO details for verification
        GovernorFactory.DAOConfig memory dao = governorFactory.getDao(0);
        console.log("Governor Address 1:", dao.governor);
        console.log("Timelock Address:", dao.timelock);
        console.log("Treasury Address:", dao.treasury);
        console.log("Token Address 1:", dao.token);
        console.log("Token Type:", uint(dao.tokenType));
        console.log("Creator Address:", dao.creator);

        dao = governorFactory.getDao(1);
        console.log("Governor Address 2:", dao.governor);
        console.log("Timelock Address 2:", dao.timelock);
        console.log("Treasury Address 2:", dao.treasury);
        console.log("Token Address 2:", dao.token);
        console.log("Token Type 2:", uint(dao.tokenType));
        console.log("Creator Address 2:", dao.creator);
    }
            

}
