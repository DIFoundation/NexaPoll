// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DGPTreasury
 * @dev DAO-controlled treasury for managing ETH and ERC20 assets.
 * Execution of spending is restricted to Governor + Timelock.
 */
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DGPTreasury {
    address public governor;

    modifier onlyGovernor() {
        require(msg.sender == governor, "Not authorized");
        _;
    }

    constructor(address _governor) {
        governor = _governor;
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyGovernor {
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawToken(address token, address recipient, uint256 amount) external onlyGovernor {
        require(IERC20(token).transfer(recipient, amount), "Token transfer failed");
    }

    receive() external payable {}
}
