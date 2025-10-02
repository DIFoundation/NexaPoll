// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC721VotingPower
 * @dev Each NFT = 1 vote. Snapshot balance is counted at proposal start.
 * Supports delegation and checkpointing for governance.
 */
contract ERC721VotingPower is ERC721, ERC721Votes, Ownable {
    uint256 private _nextTokenId;
    uint256 private immutable __maxSupply;
    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply_,
        string memory baseURI
    )
        ERC721(name, symbol)
        ERC721Votes(name)
        Ownable(msg.sender)
    {
        __maxSupply = maxSupply_;
        _baseTokenURI = baseURI;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        if (__maxSupply > 0) {
            require(_nextTokenId < __maxSupply, "Max supply reached");
        }
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function batchMint(address to, uint256 quantity) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(quantity > 0, "Quantity must be greater than 0");
        if (__maxSupply > 0) {
            require(_nextTokenId + quantity <= __maxSupply, "Exceeds max supply");
        }
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _burn(tokenId);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function maxSupply() external view returns (uint256) {
        return __maxSupply;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Required overrides for multiple inheritance

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Votes)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721Votes)
    {
        super._increaseBalance(account, amount);
    }
}