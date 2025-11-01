// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DGPTreasury (Clonable)
 * @dev DAO-controlled treasury for managing ETH and ERC20 assets.
 * Compatible with EIP-1167 minimal proxy clones.
 */
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract DGPTreasury is Initializable {
    using SafeERC20 for IERC20;

    address public timelock;
    address public governor;

    event ETHWithdrawn(address indexed recipient, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event ETHReceived(address indexed sender, uint256 amount);

    modifier onlyTimelock() {
        require(msg.sender == timelock, "DGPTreasury: caller is not timelock");
        _;
    }

    /// @dev Empty constructor to protect the logic contract
    constructor() {
        // Prevent anyone from initializing the implementation contract directly
    }

    /**
     * @dev Initialize the Treasury clone after deployment.
     * Can only be called once.
     */
    function initialize(address _timelock, address _governor) external initializer {
        require(_timelock != address(0), "DGPTreasury: invalid timelock address");
        require(_governor != address(0), "DGPTreasury: invalid governor address");

        timelock = _timelock;
        governor = _governor;
    }

    function withdrawETH(address payable recipient, uint256 amount) external onlyTimelock {
        require(recipient != address(0), "DGPTreasury: invalid recipient");
        require(amount > 0, "DGPTreasury: amount must be greater than 0");
        require(address(this).balance >= amount, "DGPTreasury: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "DGPTreasury: ETH transfer failed");

        emit ETHWithdrawn(recipient, amount);
    }

    function withdrawToken(address token, address recipient, uint256 amount) external onlyTimelock {
        require(token != address(0), "DGPTreasury: invalid token address");
        require(recipient != address(0), "DGPTreasury: invalid recipient");
        require(amount > 0, "DGPTreasury: amount must be greater than 0");

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
