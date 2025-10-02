// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC721VotingPower
 * @dev Each NFT = 1 vote. Snapshot balance is counted at proposal start.
 */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ERC721VotingPower is ERC721Enumerable {
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function getVotes(address voter) external view returns (uint256) {
        return balanceOf(voter);
    }
}
