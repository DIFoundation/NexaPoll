## Foundry

### Build

```shell
$ forge build
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
