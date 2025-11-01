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
import "@openzeppelin/contracts/access/Ownable.sol";

contract DGPTreasury is Initializable, Ownable {
    using SafeERC20 for IERC20;

    address public timelock;
    address public governor;

    event ETHWithdrawn(address indexed recipient, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event ETHReceived(address indexed sender, uint256 amount);
    event TimelockUpdated(address indexed oldTimelock, address indexed newTimelock);
    event GovernorUpdated(address indexed oldGovernor, address indexed newGovernor);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the Treasury clone after deployment.
     * @param _timelock The address of the timelock contract
     * @param _governor The address of the governor contract
     */
    function initialize(
        address _timelock, 
        address _governor, 
        address initialOwner
    ) external initializer {
        require(_timelock != address(0), "DGPTreasury: invalid timelock address");
        require(_governor != address(0), "DGPTreasury: invalid governor address");
        require(initialOwner != address(0), "DGPTreasury: invalid owner address");

        timelock = _timelock;
        governor = _governor;
        _transferOwnership(initialOwner);
    }

    modifier onlyTimelock() {
        require(msg.sender == timelock, "DGPTreasury: caller is not timelock");
        _;
    }

    /**
     * @dev Withdraw ETH from the treasury
     * @param recipient The address to receive the ETH
     * @param amount The amount of ETH to withdraw
     */
    function withdrawETH(address payable recipient, uint256 amount) external onlyTimelock {
        require(recipient != address(0), "DGPTreasury: invalid recipient");
        require(amount > 0, "DGPTreasury: amount must be greater than 0");
        require(address(this).balance >= amount, "DGPTreasury: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "DGPTreasury: ETH transfer failed");

        emit ETHWithdrawn(recipient, amount);
    }

    /**
     * @dev Withdraw ERC20 tokens from the treasury
     * @param token The address of the token contract
     * @param recipient The address to receive the tokens
     * @param amount The amount of tokens to withdraw
     */
    function withdrawToken(
        address token, 
        address recipient, 
        uint256 amount
    ) external onlyTimelock {
        require(token != address(0), "DGPTreasury: invalid token address");
        require(recipient != address(0), "DGPTreasury: invalid recipient");
        require(amount > 0, "DGPTreasury: amount must be greater than 0");

        IERC20(token).safeTransfer(recipient, amount);
        emit TokenWithdrawn(token, recipient, amount);
    }

    /**
     * @dev Update the timelock address
     * @param newTimelock The new timelock address
     */
    function updateTimelock(address newTimelock) external onlyOwner {
        require(newTimelock != address(0), "DGPTreasury: invalid timelock address");
        address oldTimelock = timelock;
        timelock = newTimelock;
        emit TimelockUpdated(oldTimelock, newTimelock);
    }

    /**
     * @dev Update the governor address
     * @param newGovernor The new governor address
     */
    function updateGovernor(address newGovernor) external onlyOwner {
        require(newGovernor != address(0), "DGPTreasury: invalid governor address");
        address oldGovernor = governor;
        governor = newGovernor;
        emit GovernorUpdated(oldGovernor, newGovernor);
    }

    /**
     * @dev Get the ETH balance of the treasury
     * @return The ETH balance
     */
    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get the token balance of the treasury
     * @param token The token address
     * @return The token balance
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }
}
