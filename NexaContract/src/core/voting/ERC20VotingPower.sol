// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC20VotingPower
 * @dev Calculates voting power based on ERC20 token balances (1 token = 1 vote).
 */
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract ERC20VotingPower is ERC20Votes {
    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        // ERC20Permit(name)
    {}

    // Voting power logic comes from ERC20Votes
}
