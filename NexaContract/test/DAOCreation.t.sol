// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";

contract testCreateDAO is Test {
    GovernorFactory public governorFactory;

    address public Bob = address(0x1);

    address public MKT = address(0x2);

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
        // Create a DAO
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

        // Verify DAO creation
        assertEq(governorFactory.getDaoCount(), 1, "DAO count should be one");
        assertTrue(governorFactory.isDAO(address(governorFactory.getDao(0).governor)), "The created governor should be recognized as a DAO");
        assertEq(governorFactory.getAllDaos().length, 1, "One DAO should exist");
        assertEq(governorFactory.getDaosByCreator(address(this)).length, 1, "Creator should have one DAO");

        // Log DAO details for verification
        GovernorFactory.DAOConfig memory dao = governorFactory.getDao(0);
        console.log("Governor Address:", dao.governor);
        console.log("Timelock Address:", dao.timelock);
        console.log("Treasury Address:", dao.treasury);
        console.log("Token Address:", dao.token);
        console.log("Token Type:", uint(dao.tokenType));
        console.log("Creator Address:", dao.creator);
        console.log("Creation Timestamp:", dao.createdAt);

    }
            

}
