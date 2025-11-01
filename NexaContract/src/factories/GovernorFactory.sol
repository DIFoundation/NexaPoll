// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";

import "../core/DGPGovernor.sol";
import "../core/DGPTimelockController.sol";
import "../core/DGPTreasury.sol";
import "../core/voting/ERC20VotingPower.sol";
import "../core/voting/ERC721VotingPower.sol";

contract GovernorFactory is Ownable {
    using Clones for address;

    enum TokenType { ERC20, ERC721 }

    struct DAOConfig {
        string daoName;
        string metadataURI;
        string daoDescription;
        address governor;
        address timelock;
        address treasury;
        address token;
        TokenType tokenType;
        address creator;
        uint256 createdAt;
    }

    // Implementation addresses (logic contracts) — set at deploy time
    address public immutable governorImplementation;
    address public immutable timelockImplementation;
    address public immutable treasuryImplementation;

    DAOConfig[] private daos;
    mapping(address => address[]) private daosByCreator;
    mapping(address => bool) public isDAO;

    event DAOCreated(
        address indexed governor,
        address indexed timelock,
        address indexed treasury,
        string daoName,
        address token,
        TokenType tokenType,
        address creator,
        uint256 daoId
    );

    event TokenDeployed(address indexed token, TokenType tokenType, string tokenName, string tokenSymbol);

    constructor(
        address _governorImplementation,
        address _timelockImplementation,
        address _treasuryImplementation
    ) Ownable(msg.sender) {
        require(_governorImplementation != address(0), "Gov impl required");
        require(_timelockImplementation != address(0), "Timelock impl required");
        require(_treasuryImplementation != address(0), "Treasury impl required");

        governorImplementation = _governorImplementation;
        timelockImplementation = _timelockImplementation;
        treasuryImplementation = _treasuryImplementation;
    }

    function createDAO(
        string memory daoName,
        string memory daoDescription,
        string memory metadataURI,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply,
        uint256 maxSupply,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 timelockDelay,
        uint256 quorumPercentage,
        TokenType tokenType,
        string memory baseURI
    ) external returns (address governor, address timelock, address treasury, address token) {
        // 1) Deploy token (regular deploy)
        token = _deployToken(tokenType, tokenName, tokenSymbol, initialSupply, maxSupply, baseURI);
        emit TokenDeployed(token, tokenType, tokenName, tokenSymbol);

        // 2) Clone and initialize timelock
        timelock = _deployTimelock(timelockDelay, msg.sender);

        // 3) Clone and initialize governor
        governor = _deployGovernor(
            token,
            timelock,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage,
            daoName
        );

        // 4) Clone and initialize treasury
        treasury = _deployTreasury(timelock, governor, msg.sender);

        // 5) Configure token & timelock roles
        _configureRoles(tokenType, token, governor, timelock);
        _recordDAO(daoName, daoDescription, metadataURI, governor, timelock, treasury, token, tokenType);

        // 6) Configure timelock roles
        _configureTimelockRoles(timelock, governor);
    }

    function _deployTimelock(uint256 delay, address admin) internal returns (address) {
        address timelockClone = timelockImplementation.clone();
        
        // Set up initial proposers and executors
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        
        // The governor will be the only proposer initially
        proposers[0] = address(this); // Temporary, will be updated
        
        // Any address can execute after the delay
        executors[0] = address(0);
        
        DGPTimelockController(payable(timelockClone)).initialize(
            delay,
            proposers,
            executors,
            admin // Initial admin
        );
        
        return timelockClone;
    }

    function _deployToken(
        TokenType tokenType,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory baseURI
    ) internal returns (address) {
        if (tokenType == TokenType.ERC20) {
            return address(new ERC20VotingPower(
                tokenName,
                tokenSymbol,
                initialSupply,
                maxSupply,
                address(this) // Factory will be the initial admin
            ));
        } else {
            return address(new ERC721VotingPower(
                tokenName,
                tokenSymbol,
                maxSupply,
                baseURI
            ));
        }
    }

    function _deployGovernor(
        address token,
        address timelock,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 quorumPercentage,
        string memory governorName
    ) internal returns (address) {
        address governorClone = governorImplementation.clone();
        DGPGovernor(governorClone).initialize(
            IVotes(token),
            TimelockController(payable(timelock)),
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumPercentage,
            msg.sender, // Owner/admin of governor contract -> DAO creator
            governorName
        );
        return governorClone;
    }

    function _deployTreasury(address timelock, address governor, address initialOwner) internal returns (address) {
        address treasuryClone = treasuryImplementation.clone();
        DGPTreasury(treasuryClone).initialize(timelock, governor, initialOwner);
        return treasuryClone;
    }

    function _configureRoles(TokenType tokenType, address token, address governor, address timelock) internal {
        if (tokenType == TokenType.ERC20) {
            ERC20VotingPower erc20 = ERC20VotingPower(token);
            erc20.grantRole(erc20.MINTER_ROLE(), governor);
            erc20.grantRole(erc20.MINTER_ROLE(), timelock);
            erc20.grantRole(erc20.DEFAULT_ADMIN_ROLE(), timelock);
            erc20.renounceRole(erc20.DEFAULT_ADMIN_ROLE(), address(this));
        } else {
            ERC721VotingPower erc721 = ERC721VotingPower(token);
            erc721.grantRole(erc721.MINTER_ROLE(), governor);
            erc721.grantRole(erc721.MINTER_ROLE(), timelock);
            erc721.grantRole(erc721.DEFAULT_ADMIN_ROLE(), timelock);
            erc721.renounceRole(erc721.DEFAULT_ADMIN_ROLE(), address(this));
        }
    }

    function _configureTimelockRoles(address timelock, address governor) internal {
        DGPTimelockController timelockContract = DGPTimelockController(payable(timelock));
        
        // Grant the governor the PROPOSER_ROLE
        timelockContract.grantRole(timelockContract.PROPOSER_ROLE(), governor);
        
        // Grant the governor the EXECUTOR_ROLE (if needed)
        timelockContract.grantRole(timelockContract.EXECUTOR_ROLE(), governor);
        
        // Revoke the factory's admin role
        timelockContract.renounceRole(timelockContract.DEFAULT_ADMIN_ROLE(), address(this));
    }

    function _recordDAO(
        string memory daoName,
        string memory daoDescription,
        string memory metadataURI,
        address governor,
        address timelock,
        address treasury,
        address token,
        TokenType tokenType
    ) internal {
        DAOConfig memory newDAO = DAOConfig({
            daoName: daoName,
            daoDescription: daoDescription,
            metadataURI: metadataURI,
            governor: governor,
            timelock: timelock,
            treasury: treasury,
            token: token,
            tokenType: tokenType,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        daos.push(newDAO);
        daosByCreator[msg.sender].push(governor);
        isDAO[governor] = true;

        emit DAOCreated(
            governor,
            timelock,
            treasury,
            daoName,
            token,
            tokenType,
            msg.sender,
            daos.length - 1
        );
    }

    // View functions remain the same...
    function getDAO(uint256 index) external view returns (DAOConfig memory) {
        require(index < daos.length, "DAO does not exist");
        return daos[index];
    }

    function getDAOCount() external view returns (uint256) {
        return daos.length;
    }

    function getDAOsByCreator(address creator) external view returns (DAOConfig[] memory) {
        uint256 count = daosByCreator[creator].length;
        DAOConfig[] memory creatorDAOs = new DAOConfig[](count);
        
        for (uint256 i = 0; i < count; i++) {
            for (uint256 j = 0; j < daos.length; j++) {
                if (daos[j].governor == daosByCreator[creator][i]) {
                    creatorDAOs[i] = daos[j];
                    break;
                }
            }
        }
        
        return creatorDAOs;
    }

    function getDaosByTokenType(TokenType tokenType) external view returns (DAOConfig[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < daos.length; i++) {
            if (daos[i].tokenType == tokenType) {
                count++;
            }
        }
        
        DAOConfig[] memory result = new DAOConfig[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < daos.length; i++) {
            if (daos[i].tokenType == tokenType) {
                result[index] = daos[i];
                index++;
            }
        }
        
        return result;
    }
}
