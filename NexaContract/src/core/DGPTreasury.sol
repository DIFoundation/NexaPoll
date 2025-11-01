// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// DGPTreasury.sol (Non-Upgradeable Clone Pattern)
// ============================================
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DGPTreasury {
    using SafeERC20 for IERC20;

    bool private _initialized;
    address public timelock;
    address public governor;
    
    event ETHWithdrawn(address indexed recipient, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event ETHReceived(address indexed sender, uint256 amount);

    modifier onlyTimelock() {
        require(msg.sender == timelock, "DGPTreasury: caller is not timelock");
        _;
    }

    constructor() {}

    function initialize(address _timelock, address _governor) external {
        require(!_initialized, "Already initialized");
        require(_timelock != address(0), "Invalid timelock address");
        require(_governor != address(0), "Invalid governor address");
        
        _initialized = true;
        timelock = _timelock;
        governor = _governor;
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyTimelock {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit ETHWithdrawn(recipient, amount);
    }

    function withdrawToken(address token, address recipient, uint256 amount) external onlyTimelock {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        
        IERC20(token).safeTransfer(recipient, amount);
        emit TokenWithdrawn(token, recipient, amount);
    }

    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }
}
