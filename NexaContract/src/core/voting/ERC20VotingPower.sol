// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ERC20VotingPower
 * @dev ERC20 token with voting power delegation, snapshot capabilities, and admin-controlled minting.
 * Each token = 1 vote weight. Supports delegation and checkpointing.
 * Only accounts with MINTER_ROLE can mint new tokens.
 */
contract ERC20VotingPower is ERC20, ERC20Permit, ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private immutable _tokenMaxSupply;

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
        ERC20Permit(name)
    {
        require(maxSupply_ == 0 || initialSupply <= maxSupply_, "Initial supply exceeds max supply");
        _tokenMaxSupply = maxSupply_;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    /**
     * @dev Mint new tokens (only callable by MINTER_ROLE)
     * @param to Address to receive tokens
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        if (_tokenMaxSupply > 0) {
            require(totalSupply() + amount <= _tokenMaxSupply, "Exceeds max supply");
        }
        _mint(to, amount);
    }

    /**
     * @dev Batch mint tokens to multiple addresses (only callable by MINTER_ROLE)
     * @param recipients Array of addresses to receive tokens
     * @param amounts Array of amounts to mint to each address
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyRole(MINTER_ROLE) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (amounts[i] > 0 && recipients[i] != address(0)) {
                if (_tokenMaxSupply > 0) {
                    require(totalSupply() + amounts[i] <= _tokenMaxSupply, "Exceeds max supply");
                }
                _mint(recipients[i], amounts[i]);
            }
        }
    }

    // The following functions are overrides required by Solidity
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}