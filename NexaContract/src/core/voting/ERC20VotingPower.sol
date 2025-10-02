// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC20VotingPower
 * @dev ERC20 token with voting power delegation and snapshot capabilities.
 * Each token = 1 vote weight. Supports delegation and checkpointing.
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20VotingPower is ERC20, ERC20Votes, Ownable {
    uint256 private immutable __maxSupply;

    /**
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial supply minted to deployer
     * @param maxSupply_ Maximum supply that can ever exist (0 = unlimited)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply_
    )
        ERC20(name, symbol)
        ERC20Votes(name)
        Ownable(msg.sender)
    {
        require(maxSupply_ == 0 || initialSupply <= maxSupply_, "Initial supply exceeds max supply");
        __maxSupply = maxSupply_;
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive tokens
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        if (__maxSupply > 0) {
            require(totalSupply() + amount <= __maxSupply, "Exceeds max supply");
        }
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from caller
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Get max supply (0 = unlimited)
     */
    function maxSupply() external view returns (uint256) {
        return __maxSupply;
    }

    // Required overrides for multiple inheritance

    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, amount);
    }
}