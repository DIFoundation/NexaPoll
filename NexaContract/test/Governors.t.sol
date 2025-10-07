// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";

contract GovernorsTest is Test {
    GovernorFactory public governorFactory;

    address public Bob = address(0x1);
    address public Alice = address(0x2);

    function setUp() public {
        governorFactory = new GovernorFactory();

        vm.deal(Bob, 100 ether);
        vm.startPrank(Bob);
        one == governorFactory.createDAO(
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

        
    }

    function testNewDAO() public {
        assert(address(governorFactory) != address(0));

        assertEq(governorFactory.getDaoCount(), 1, "Initial DAO count should be one");
        // assertFalse(governorFactory.getDao(1).exists, "DAO at index 1 should exist false");
        assertEq(governorFactory.getAllDaos().length, 1, "one DAO count");
        assertEq(governorFactory.getDaosByCreator(Bob).length, 0, "Bob should have zero DAOs");
    
    }
}
