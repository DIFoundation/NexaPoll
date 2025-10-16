// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {GovernorFactory} from "../src/factories/GovernorFactory.sol";
import {DGPGovernor} from "../src/core/DGPGovernor.sol";

contract GovernorsTest is Test {
    GovernorFactory public governorFactory;

    address public Bob = address(0x1);
    address public Alice = address(0x2);

    function setUp() public {

        governorFactory = new GovernorFactory();

    }

    function testCreateDAO() public {
        vm.deal(Bob, 100 ether);
        vm.startPrank(Bob);
        governorFactory.createDAO(
            "My First DAO",
            "Description of My First DAO",
            "Metadata URI for My First",
            "DAO Token",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            "NFTBaseURI"
        );

        vm.stopPrank();

        assert(address(governorFactory) != address(0));

        assertEq(governorFactory.getDaoCount(), 1, "Initial DAO count should be one");
        // assertFalse(governorFactory.getDao(1).exists, "DAO at index 1 should exist false");
        assertEq(governorFactory.getAllDaos().length, 1, "one DAO count");
        assertEq(governorFactory.getDaosByCreator(Bob).length, 1, "Bob should have one DAO");
    }

    function testNewGovernor() public {

        vm.deal(Bob, 100 ether);
        vm.startPrank(Bob);
        (address governor, , , ) = governorFactory.createDAO(
            "My First DAO",
            "Description of My First DAO",
            "Metadata URI for My First",
            "DAO Token",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            "NFTBaseURI"
        );

        vm.stopPrank();

        DGPGovernor dgpGovernor = DGPGovernor(payable(governor));

        assertEq(dgpGovernor.listMembers().length, 0, "No Member Yet");

        dgpGovernor.addMember(Alice, 10e18);

        assertEq(dgpGovernor.listMembers().length, 1, "One Member Added");
        assertEq(dgpGovernor.listMembers()[0], Alice, "Alice is the member");
        
    }

    function testAddMember() public {

        vm.deal(Bob, 100 ether);
        vm.startPrank(Bob);
        (address governor, , , ) = governorFactory.createDAO(
            "My First DAO",
            "Description of My First DAO",
            "Metadata URI for My First",
            "DAO Token",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            "NFTBaseURI"
        );

        DGPGovernor dgpGovernor = DGPGovernor(payable(governor));
        dgpGovernor.addMember(Alice, 100e18);

        vm.stopPrank();

        assertEq(dgpGovernor.listMembers().length, 1, "One Member Added");
        assertEq(dgpGovernor.listMembers()[0], Alice, "Alice is the member");
    }

    function testRemoveMember() public {
        (address governor, , , ) = governorFactory.createDAO(
            "My First DAO",
            "Description of My First DAO",
            "Metadata URI for My First",
            "DAO Token",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            "NFTBaseURI"
        );

        DGPGovernor dgpGovernor = DGPGovernor(payable(governor));

        // Add Alice before removing her
        dgpGovernor.addMember(Alice, 100e18);
        assertEq(dgpGovernor.listMembers().length, 1, "One Member Added");

        dgpGovernor.removeMember(Alice);
        assertEq(dgpGovernor.listMembers().length, 0, "One Member Removed");
    }

    function testAddMemberAndPropose() public {
        (address governor, , , ) = governorFactory.createDAO(
            "My First DAO",
            "Description of My First DAO",
            "Metadata URI for My First",
            "DAO Token",
            "MKT",
            1000000e18, // Initial supply for ERC20
            0,          // Max supply (0 for unlimited)
            1,          // Voting delay in blocks
            50400,      // Voting period in blocks (~1 week)
            100e18,     // Proposal threshold
            1 days,     // Timelock delay in seconds
            51,         // Quorum percentage
            GovernorFactory.TokenType.ERC20, // Token type
            "NFTBaseURI"
        );

        DGPGovernor dgpGovernor = DGPGovernor(payable(governor));
        dgpGovernor.addMember(Alice, 100e18);

        vm.startPrank(Alice);
        address[] memory targets = new address[](0);
        uint256[] memory values = new uint256[](0);
        bytes[] memory calldatas = new bytes[](0);
        uint256 proposalId = dgpGovernor.proposeWithMetadata(
            targets,
            values,
            calldatas,
            "Test Proposal",
            "This is a test proposal.",
            "Test",
            "Solution",
            "Rationale",
            "Outcomes",
            "Timeline",
            "Budget"
        );
        vm.stopPrank();

        DGPGovernor.ProposalMetadata memory meta = dgpGovernor.getProposalMetadata(proposalId);
        assertEq(meta.title, "Test Proposal", "Proposal title should be correct");
    }
}
