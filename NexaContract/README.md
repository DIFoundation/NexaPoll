## Foundry

### Build

```shell
forge clean
forge build
forge inspect src/core/DGPGovernor.sol:DGPGovernor bytecode | wc -c

$ 
For CeloSepolia
forge script script/Deploy.s.sol:DeployScript 
    --rpc-url $CELOSEPOLIA_RPC_URL 
    --broadcast
    --etherscan-api-key $ETHERSCAN_API_KEY
    --verify

For BaseSepolia
forge script script/Deploy.s.sol:DeployScript 
    --rpc-url $BASESEPOLIA_RPC_URL 
    --broadcast
    --etherscan-api-key $ETHERSCAN_API_KEY
    --verify
```

contracts/
│
├── core/
│   ├── DGPGovernor.sol
│   ├── DGPTimelockController.sol
│   ├── DGPTreasury.sol
│   ├── voting/
│   │   ├── ERC20VotingPower.sol
│   │   ├── ERC721VotingPower.sol
│   │   └── IVotingPower.sol
│
├── factories/
│   ├── GovernorFactory.sol
│   └── VotingTokenFactory.sol
│
├── upgradeability/
│   ├── ProxyAdmin.sol
│   └── UUPSProxy.sol
│
├── utils/
│   ├── ProposalValidator.sol
│   ├── QuorumCalculator.sol
│   └── Events.sol
│
└── interfaces/
    ├── IGovernor.sol
    ├── ITreasury.sol
    └── IFactory.sol

MVP

contracts/
│
├── core/
│   ├── DGPGovernor.sol   
│   ├── DGPTimelockController.sol   
│   ├── DGPTreasury.sol              
│   │
│   └── voting/
│       ├── IVotingPower.sol         
│       ├── ERC20VotingPower.sol    
│       └── ERC721VotingPower.sol   
│
├── factories/
│   └── GovernorFactory.sol          
│
└── interfaces/
    └── IGovernor.sol                


|--- future feature ---|
Introduce ENS as future plan
ADvance voting type
off chain voting
Treasury with multi sig

Proposal metadata should be stored offChain

include general voting in future
