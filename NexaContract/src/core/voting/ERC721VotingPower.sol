// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC721VotingPower
 * @dev Each NFT = 1 vote. Snapshot balance is counted at proposal start.
 */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract ERC721VotingPower is ERC721Votes {
    constructor(string memory name, string memory symbol)
        ERC721Votes(name, symbol)
    {}
}
