# PRODUCT REQUIREMENTS DOCUMENT: DECENTRALIZED GOVERNANCE PROTOCOL (DGP)

**Version**: 2.0  
**Date**: October 1, 2025  
**Status**: Production Specification  
**Document Owner**: Product & Engineering Teams  
**Last Updated**: October 1, 2025

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Sept 4, 2025 | Initial Team | Initial draft |
| 2.0 | Oct 1, 2025 | Enhanced | Production-ready specification |

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Introduction & Vision](#2-introduction--vision)
3. [Market Analysis & Competitive Landscape](#3-market-analysis--competitive-landscape)
4. [Target Audience & User Personas](#4-target-audience--user-personas)
5. [Core Features & Functionality](#5-core-features--functionality)
6. [Technical Architecture](#6-technical-architecture)
7. [Smart Contract Specifications](#7-smart-contract-specifications)
8. [Frontend Application Specifications](#8-frontend-application-specifications)
9. [Security & Compliance](#9-security--compliance)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment & Operations](#11-deployment--operations)
12. [Success Metrics & KPIs](#12-success-metrics--kpis)
13. [Roadmap & Release Plan](#13-roadmap--release-plan)
14. [Risk Assessment & Mitigation](#14-risk-assessment--mitigation)
15. [Future Considerations](#15-future-considerations)
16. [Appendices](#16-appendices)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Overview
The Decentralized Governance Protocol (DGP) is a production-grade, audited smart contract system and user-friendly dApp that enables organizations to conduct transparent, secure, and fully on-chain governance. Built on battle-tested OpenZeppelin standards, DGP provides the infrastructure for DAOs, protocols, and decentralized organizations to make binding decisions through cryptographically verifiable voting.

### 1.2 Key Differentiators
- **Production-Ready Security**: Professional audit, comprehensive testing, formal verification
- **Flexible Architecture**: Modular design supporting multiple voting strategies
- **Superior UX**: Intuitive interface that abstracts blockchain complexity
- **Full Transparency**: Complete on-chain audit trail with efficient indexing
- **Enterprise-Grade**: Built for scale, performance, and reliability

### 1.3 Success Criteria
- Zero security vulnerabilities in production
- <2 second average page load time
- Support 10,000+ concurrent voters per proposal
- 95%+ wallet connection success rate
- <$5 average gas cost per vote on Layer 2s

---

## 2. INTRODUCTION & VISION

### 2.1 The Problem Statement

**Current Challenges in Decentralized Governance:**

1. **Fragmentation & Centralization**: Many DAOs rely on off-chain voting (Discord polls, Google Forms) with manual on-chain execution, creating trust assumptions and execution risks.

2. **High Costs**: Direct on-chain voting on Ethereum mainnet can cost $50-200 per vote during periods of high gas prices, excluding smaller token holders.

3. **Poor User Experience**: Existing solutions require technical knowledge, multiple transaction confirmations, and provide minimal feedback during the voting process.

4. **Security Vulnerabilities**: Flash loan attacks, governance takeovers, and smart contract exploits have resulted in millions in losses across DeFi protocols.

5. **Lack of Flexibility**: Most governance systems are rigid, requiring contract upgrades or migrations to change voting mechanisms.

6. **Limited Transparency**: Vote history, proposal outcomes, and execution details are often difficult to access or verify.

### 2.2 Vision Statement

To create the **most secure, flexible, and user-friendly on-chain governance platform** that becomes the standard for decentralized decision-making across Web3. DGP will empower any community—from small DAOs to large protocols—to govern transparently and efficiently, making decentralized governance accessible to everyone.

### 2.3 High-Level Objectives

#### Decentralization
- 100% on-chain execution with zero admin keys in production
- Trustless voting where outcomes are determined solely by smart contract logic
- Community-controlled upgrades through governance itself

#### Transparency
- All proposals, votes, and executions publicly verifiable
- Comprehensive event logging for complete audit trails
- Real-time indexing for instant historical access

#### Security
- Zero-tolerance approach to vulnerabilities
- Defense-in-depth architecture with multiple security layers
- Resistance to known attack vectors (flash loans, governance takeovers, re-entrancy)

#### Flexibility
- Support for ERC20, ERC721, and future token standards
- Configurable voting parameters per deployment
- Modular architecture for custom voting strategies

#### User Experience
- Sub-3-click voting process from dashboard to confirmation
- Clear, jargon-free interface
- Real-time updates and transaction status tracking
- Mobile-responsive design

#### Performance
- Fast load times (<2s) even with thousands of proposals
- Efficient gas usage (<100k gas per vote)
- Support for high-volume governance activity

---

## 3. MARKET ANALYSIS & COMPETITIVE LANDSCAPE

### 3.1 Market Opportunity

**Total Addressable Market (TAM):**
- 10,000+ active DAOs managing $20B+ in treasuries
- 50,000+ NFT projects with community governance needs
- Growing corporate adoption of DAO structures

**Target Market Share:** 15% of new DAO deployments in Year 1

### 3.2 Competitive Analysis

| Feature | DGP | Snapshot + Safe | Tally | Aragon | Colony |
|---------|-----|-----------------|-------|---------|---------|
| Fully On-chain | ✅ | ⚠️ Hybrid | ✅ | ✅ | ✅ |
| ERC20 Voting | ✅ | ✅ | ✅ | ✅ | ✅ |
| NFT Voting | ✅ | ✅ | ✅ | ❌ | ❌ |
| Timelock Protection | ✅ | ⚠️ Via Safe | ✅ | ✅ | ❌ |
| Professional Audit | ✅ | N/A | ✅ | ✅ | ✅ |
| Custom Voting Strategies | ✅ | ✅ | ⚠️ Limited | ⚠️ Limited | ❌ |
| Subgraph Indexing | ✅ | ✅ | ✅ | ⚠️ Limited | ❌ |
| Modern UX/UI | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| Multi-chain Support | ✅ | ✅ | ✅ | ⚠️ Limited | ❌ |
| Open Source | ✅ | ✅ | ⚠️ Partial | ✅ | ✅ |

### 3.3 Competitive Advantages

1. **Best-in-class Security**: Multiple audits, formal verification, bug bounty program
2. **Superior UX**: Consumer-grade interface vs. developer-focused tools
3. **True Flexibility**: Plugin architecture for voting strategies
4. **Complete Solution**: End-to-end governance without external dependencies
5. **Performance Optimized**: Gas-efficient contracts, fast indexing, responsive UI

---

## 4. TARGET AUDIENCE & USER PERSONAS

### 4.1 Primary Personas

#### Persona 1: DAO Administrator (Sarah)
**Demographics:**
- Age: 28-45
- Role: DAO Core Team, Operations Lead
- Technical Level: Intermediate (understands blockchain basics, not a developer)

**Context:**
- Managing a DAO with 500-5,000 members
- Responsible for governance infrastructure setup
- Needs reliable, audited systems for treasury management

**Goals:**
- Deploy governance contracts without custom development
- Configure voting parameters to match community needs
- Monitor governance health and participation metrics
- Ensure security of treasury funds

**Pain Points:**
- Current tools require technical expertise or expensive consultants
- Fear of security vulnerabilities or governance attacks
- Difficulty explaining governance mechanics to community
- Limited visibility into governance analytics

**User Stories:**
- "As a DAO admin, I need to deploy a governance system in under 30 minutes without writing code."
- "As a DAO admin, I need to configure quorum and voting periods to match our community size."
- "As a DAO admin, I need a dashboard showing participation rates and proposal outcomes."

**Success Metrics:**
- Time to deployment: <30 minutes
- Configuration errors: 0
- Security incidents: 0

---

#### Persona 2: Proposal Creator (Marcus)
**Demographics:**
- Age: 22-50
- Role: Active community member, contributor
- Technical Level: Beginner to Intermediate

**Context:**
- Wants to propose new initiatives, parameter changes, or treasury allocations
- May not have prior experience with on-chain governance
- Needs to convince the community with clear proposals

**Goals:**
- Create well-structured proposals that get attention
- Include all necessary details (budget, timeline, execution)
- Track proposal progress from draft to execution
- Understand why proposals succeed or fail

**Pain Points:**
- Unclear what information to include in proposals
- Doesn't know if they meet the proposal threshold
- Can't track proposal status easily
- Uncertain about gas costs for proposal submission

**User Stories:**
- "As a proposal creator, I need a template that guides me through writing effective proposals."
- "As a proposal creator, I need to see my voting power before attempting to submit."
- "As a proposal creator, I need notifications when my proposal status changes."
- "As a proposal creator, I need to estimate gas costs before submitting."

**Success Metrics:**
- Proposal completion rate: >80%
- Average time to create proposal: <15 minutes
- Proposal rejection due to formatting: <5%

---

#### Persona 3: Active Voter (Kenji)
**Demographics:**
- Age: 20-60
- Role: Token/NFT holder, community member
- Technical Level: Beginner

**Context:**
- Holds governance tokens or NFTs
- Wants to participate in governance but has limited time
- May be voting from mobile device
- Concerned about transaction costs

**Goals:**
- Quickly understand what they're voting on
- Cast votes easily from any device
- Verify their vote was counted correctly
- Minimize gas costs

**Pain Points:**
- Proposals are too long or unclear
- Voting process requires too many steps
- Uncertain if transaction succeeded
- Gas costs too high on mainnet

**User Stories:**
- "As a voter, I need to understand a proposal in under 2 minutes."
- "As a voter, I need to vote in 3 clicks or fewer."
- "As a voter, I need immediate confirmation that my vote counted."
- "As a voter, I need to see historical proposals I've voted on."

**Success Metrics:**
- Average time to vote: <90 seconds
- Vote transaction success rate: >98%
- Mobile voting completion rate: >85%

---

#### Persona 4: Governance Observer (Priya)
**Demographics:**
- Age: 25-55
- Role: Potential investor, researcher, community member
- Technical Level: Beginner to Advanced

**Context:**
- Evaluating whether to invest in or join the DAO
- Researching governance practices for report or article
- Monitoring specific proposals without voting rights

**Goals:**
- Access complete governance history
- Verify voting outcomes independently
- Export data for analysis
- Track specific wallets or proposals

**Pain Points:**
- Historical data is hard to access
- No way to verify vote counts independently
- Limited search and filter capabilities
- Can't export data for analysis

**User Stories:**
- "As an observer, I need to view all historical proposals without connecting a wallet."
- "As an observer, I need to verify vote counts against blockchain data."
- "As an observer, I need to export proposal data to CSV."
- "As an observer, I need to search proposals by keyword, date, or outcome."

**Success Metrics:**
- Public proposal data accessibility: 100%
- Data export functionality: Available
- Search result accuracy: >95%

---

### 4.2 Secondary Personas

#### Persona 5: Smart Contract Developer (Integration Partner)
**Demographics:**
- Age: 24-40
- Role: Protocol developer, technical contributor
- Technical Level: Advanced

**Context:**
- Building custom governance extensions
- Integrating DGP with existing protocols
- Needs comprehensive documentation

**Goals:**
- Understand contract architecture quickly
- Extend functionality without forking
- Integrate with existing systems
- Ensure security best practices

**User Stories:**
- "As a developer, I need complete API documentation for all contracts."
- "As a developer, I need example integration code."
- "As a developer, I need to understand the upgrade process."

---

## 5. CORE FEATURES & FUNCTIONALITY

### 5.1 Feature Priority Matrix

| Feature Category | Priority | Release |
|-----------------|----------|---------|
| Core Governance Contracts | P0 - Critical | v1.0 |
| ERC20 Token Voting | P0 - Critical | v1.0 |
| ERC721 NFT Voting | P0 - Critical | v1.0 |
| Timelock Execution | P0 - Critical | v1.0 |
| Proposal Creation & Voting UI | P0 - Critical | v1.0 |
| Wallet Integration | P0 - Critical | v1.0 |
| Subgraph Indexing | P0 - Critical | v1.0 |
| Proposal Search & Filter | P1 - High | v1.0 |
| Real-time Vote Updates | P1 - High | v1.0 |
| Mobile Responsive Design | P1 - High | v1.0 |
| Email Notifications | P2 - Medium | v1.1 |
| Proposal Templates | P2 - Medium | v1.1 |
| Governance Analytics Dashboard | P2 - Medium | v1.1 |
| Vote Delegation | P3 - Low | v2.0 |
| Multi-signature Co-signing | P3 - Low | v2.0 |

---

### 5.2 Smart Contract Features (Detailed)

#### 5.2.1 Core Governance Module

**Architecture Foundation:**
- Built on OpenZeppelin Governor v4.9+
- Modular design with upgradeable proxies (UUPS pattern)
- Event-driven architecture for efficient indexing

**Proposal Lifecycle Management:**

```
States: Pending → Active → [Succeeded/Defeated] → Queued → [Executed/Expired]

State Transitions:
1. Created → Pending (Voting Delay period)
2. Pending → Active (Voting begins)
3. Active → Succeeded (Quorum met, For > Against)
4. Active → Defeated (Quorum not met OR Against ≥ For)
5. Succeeded → Queued (Proposal queued in Timelock)
6. Queued → Executed (After timelock delay, execution succeeds)
7. Queued → Expired (Timelock grace period expires without execution)
8. Any → Canceled (Proposer or guardian cancels before execution)
```

**Configurable Governance Parameters:**

| Parameter | Description | Default | Min | Max | Configurable By |
|-----------|-------------|---------|-----|-----|-----------------|
| Voting Delay | Blocks between proposal creation and vote start | 1 day | 1 block | 2 weeks | Governance |
| Voting Period | Duration of active voting | 1 week | 1 day | 4 weeks | Governance |
| Quorum (%) | Minimum participation required | 4% | 0.1% | 50% | Governance |
| Proposal Threshold | Tokens needed to propose | 0.1% supply | 0% | 10% | Governance |
| Timelock Delay | Delay before execution | 2 days | 1 day | 30 days | Governance |
| Timelock Grace Period | Window for execution after delay | 14 days | 1 day | 30 days | Governance |

**Guardian Role:**
- Optional guardian address for emergency proposal cancellation
- Can cancel malicious proposals before execution
- Cannot cancel executed proposals
- Guardian can be removed via governance vote
- Use case: Protect against governance attacks during bootstrap phase

**Proposal Types:**

1. **Standard Proposals**: General governance decisions
2. **Treasury Proposals**: Fund transfers from treasury
3. **Parameter Change Proposals**: Update governance settings
4. **Upgrade Proposals**: Smart contract upgrades via proxy
5. **Emergency Proposals**: Fast-tracked critical decisions (requires higher quorum)

---

#### 5.2.2 Voting Mechanism

**Voting Power Calculation:**

**ERC20 Token Voting:**
```solidity
// Snapshot at proposal creation block
votingPower = token.getPastVotes(voter, proposalSnapshot)

// Supports:
- Standard ERC20 tokens (1 token = 1 vote)
- ERC20Votes with delegation
- Checkpoint-based balance tracking
```

**ERC721 NFT Voting:**
```solidity
// Count NFTs held at snapshot block
votingPower = nftToken.balanceOfAt(voter, proposalSnapshot)

// Supports:
- Standard ERC721 (1 NFT = 1 vote)
- ERC721Enumerable for efficient counting
- Multiple NFT collections (weighted or equal voting)
```

**Hybrid Voting (v1.1):**
- Combine ERC20 and ERC721 voting power
- Configurable weights per token type
- Example: 100 tokens OR 1 NFT = 1 vote

**Vote Types & Counting:**

| Vote Type | Effect on Proposal | Counts Toward Quorum |
|-----------|-------------------|----------------------|
| For | Support proposal | Yes |
| Against | Oppose proposal | Yes |
| Abstain | No position, signals engagement | Yes |

**Vote Calculation:**
```
Proposal Succeeds IF:
- (For + Against + Abstain) ≥ Quorum
- AND For > Against

Quorum Check:
totalVotes = forVotes + againstVotes + abstainVotes
quorumReached = (totalVotes / totalSupplyAtSnapshot) ≥ quorumPercentage
```

**Double-Voting Prevention:**
- One vote per address per proposal
- Subsequent votes overwrite previous votes (with clear UI warning)
- Vote changes emit events for transparency

**Gas Optimization:**
- Bitmap storage for vote tracking (1 bit per voter per proposal)
- Packed structs to minimize storage slots
- Batch vote tallying for large proposals

---

#### 5.2.3 Treasury & Execution System

**Treasury Contract Features:**

**Asset Management:**
- Native ETH/MATIC/etc. support
- ERC20 token management with allowance system
- ERC721/ERC1155 NFT custody
- Multiple treasury accounts per DAO (e.g., operations, grants, development)

**Spending Controls:**
- All spending requires successful governance vote
- Per-transaction execution limit (configurable, e.g., max 10% treasury per proposal)
- Multi-call execution for complex proposals
- Revert handling with detailed error messages

**Treasury Functions:**
```solidity
- receiveETH(): Accept native currency deposits
- withdrawETH(address to, uint256 amount): Send ETH (governance only)
- withdrawERC20(token, to, amount): Send tokens (governance only)
- approveERC20(token, spender, amount): Approve spending (governance only)
- executeMultiCall(Call[] calls): Execute multiple actions atomically
```

**Timelock Controller:**

**Purpose:** Mandatory delay between proposal success and execution
- Prevents immediate execution of potentially malicious proposals
- Gives community time to detect and react to attacks
- Standard practice in secure governance systems

**Timelock Parameters:**
```solidity
minDelay: 2 days (configurable)
gracePeriod: 14 days (configurable)
proposer: Governor contract
executor: Governor contract or any address (configurable)
canceller: Guardian or governance
```

**Timelock Operations:**
```
1. Queue: Proposal passes, queued in Timelock with execution timestamp
2. Delay Period: Minimum wait time before execution (e.g., 2 days)
3. Grace Period: Window to execute before proposal expires (e.g., 14 days)
4. Execute: Call executeTransaction() to execute queued proposal
5. Cancel: Guardian or governance can cancel queued proposals
```

**Execution Flow:**
```
Proposal Succeeds
    ↓
Queue in Timelock (timestamp = now + minDelay)
    ↓
Wait minDelay period
    ↓
Execute (if before gracePeriod expires)
    ↓
On-chain Actions Execute
```

**Security Features:**
- Separate proposer, executor, and canceller roles
- Timelock transactions are deterministic (hash-based)
- Cannot execute same transaction twice
- All operations emit detailed events

---

#### 5.2.4 Upgradability & Access Control

**Proxy Pattern: UUPS (Universal Upgradeable Proxy Standard)**

**Why UUPS over Transparent Proxy:**
- More gas efficient (upgrade logic in implementation)
- Smaller proxy contract
- Better suited for governance-controlled upgrades

**Upgrade Process:**
```
1. Create upgrade proposal with new implementation address
2. Community votes on upgrade
3. Proposal succeeds and queued in Timelock
4. After timelock delay, execute upgrade
5. Proxy now points to new implementation
6. All data preserved (storage layout compatibility enforced)
```

**Storage Layout Management:**
- Use OpenZeppelin storage gaps (`uint256[50] __gap`)
- Document storage layout in contracts
- Use storage layout validation tools (hardhat-storage-layout)
- Test storage compatibility in upgrade tests

**Access Control Framework:**

**Role-Based Access Control (RBAC):**
```solidity
Roles:
- DEFAULT_ADMIN_ROLE: Can manage all roles (transferred to governance after deployment)
- PROPOSER_ROLE: Can create proposals (any address meeting threshold)
- EXECUTOR_ROLE: Can execute queued proposals (Timelock contract)
- CANCELLER_ROLE: Can cancel proposals (Guardian, optional)
- UPGRADER_ROLE: Can upgrade contracts (Governance only)
```

**Role Management:**
- Initial deployment: Deployer has DEFAULT_ADMIN_ROLE
- Post-deployment: Transfer admin to governance contract
- After transfer: Only governance votes can modify roles
- Emergency guardian: Optional, can be removed via governance

**Access Control Matrix:**

| Action | Role Required | Fallback |
|--------|--------------|----------|
| Create Proposal | Meets proposal threshold | None |
| Vote on Proposal | Holds voting tokens | None |
| Queue Proposal | PROPOSER_ROLE (Governor) | None |
| Execute Proposal | EXECUTOR_ROLE (Timelock) | None |
| Cancel Proposal | CANCELLER_ROLE | Proposer (if not executed) |
| Upgrade Contract | UPGRADER_ROLE (Governance) | None |
| Change Parameters | Governance Vote | None |

---

#### 5.2.5 Security Features & Attack Mitigation

**Flash Loan Attack Prevention:**
- **Voting Delay:** Minimum 1 block (default 1 day) between proposal creation and voting start
- **Snapshot Mechanism:** Voting power determined at proposal creation block
- **Checkpoint System:** Historical balance tracking prevents manipulation

**Governance Takeover Protection:**
- **High Proposal Threshold:** Prevents spam proposals from attackers
- **Quorum Requirements:** Requires significant community participation
- **Timelock Delay:** Gives community time to detect malicious proposals
- **Guardian Role:** Optional emergency cancellation mechanism

**Re-entrancy Protection:**
- NonReentrantGuard on all external functions that modify state
- Checks-Effects-Interactions pattern throughout
- Pull-over-push for payments when possible

**Integer Overflow/Underflow:**
- Solidity 0.8+ built-in overflow checks
- Explicit SafeMath usage where needed for clarity
- Comprehensive bounds checking on user inputs

**Front-running Mitigation:**
- Vote changes tracked transparently
- No incentive for vote order manipulation
- Proposal outcomes determined by final tally, not vote sequence

**Denial of Service Protection:**
- Gas limits on batch operations
- Pagination for large queries
- Circuit breakers for emergency pause (governance-activated)

**Input Validation:**
- All user inputs validated and sanitized
- Range checks on numeric parameters
- Address zero checks on critical functions
- Array length limits on batch operations

---

### 5.3 Frontend Application Features (Detailed)

#### 5.3.1 Dashboard & Navigation

**Homepage/Dashboard Components:**

**Header Navigation:**
- Logo/Branding (customizable per deployment)
- Primary Navigation: Proposals | Create | Treasury | Analytics | Docs
- Wallet Connection Button (sticky, always visible)
- Network Selector (shows current chain, allows switching)
- User Menu (profile, voting history, settings)

**Proposal List (Primary View):**

**Filter & Sort Controls:**
```
Filters:
- Status: All | Active | Pending | Passed | Failed | Executed
- Type: All | Treasury | Parameter | Upgrade | Emergency
- My Votes: Show only proposals I've voted on
- Date Range: Last 24h | Week | Month | All Time

Sort Options:
- Most Recent
- Ending Soon
- Most Votes
- Highest Impact (by requested funds)
```

**Proposal Card Layout:**
```
┌─────────────────────────────────────────┐
│ [STATUS BADGE]  #123                     │
│                                          │
│ Proposal Title Here                      │
│ Brief description preview (200 chars)... │
│                                          │
│ ⬆ For: 45,000 (45%)    Quorum: ✓        │
│ ⬇ Against: 30,000 (30%)                 │
│ ⊝ Abstain: 25,000 (25%)                 │
│                                          │
│ ⏰ 3 days remaining | 👤 0x123...abc     │
│                                          │
│ [View Details →]                         │
└─────────────────────────────────────────┘
```

**Status Badges:**
- 🟢 Active (voting open)
- 🟡 Pending (voting delay)
- ✅ Passed (succeeded)
- ❌ Failed (defeated)
- ⏳ Queued (in timelock)
- ✔️ Executed (completed)
- 🚫 Canceled

**Empty States:**
- No proposals: "No proposals yet. Be the first to create one!"
- No results: "No proposals match your filters. Try adjusting them."
- Loading: Skeleton screens with shimmer effect

**Pagination:**
- 20 proposals per page
- Infinite scroll OR traditional pagination (A/B test)
- "Load More" button as fallback

---

#### 5.3.2 Proposal Creation Flow

**Step-by-Step Wizard:**

**Step 1: Proposal Type Selection**
```
Select Proposal Type:
○ Treasury Allocation (send funds from treasury)
○ Parameter Change (update governance settings)
○ Smart Contract Upgrade (deploy new implementation)
○ General Proposal (other governance action)
○ Custom (advanced users)

[Continue →]
```

**Step 2: Basic Information**
```
Proposal Title*
[                                                    ]
Max 100 characters

Short Description*
[                                                    ]
Max 280 characters (shown in list views)

Full Description* (Markdown supported)
[                                                    ]
[                                                    ]
[                                                    ]

Preview | Markdown Guide

Proposal Category (optional)
[Dropdown: Operations | Development | Marketing | Treasury | Other]

[← Back]  [Continue →]
```

**Step 3: Actions to Execute** (Type-Specific)

**For Treasury Proposals:**
```
Actions to Execute
┌──────────────────────────────────────┐
│ Action 1: Transfer ERC20 Token       │
│                                      │
│ Token Address*                       │
│ [0x...]  [Validate ✓]               │
│ Token: DAI | Balance: 100,000        │
│                                      │
│ Recipient Address*                   │
│ [0x...]  [Resolve ENS]               │
│                                      │
│ Amount*                              │
│ [1000] DAI                           │
│ (Treasury Balance: 100,000 DAI)      │
│                                      │
│ [Remove Action]                      │
└──────────────────────────────────────┘

[+ Add Another Action]

Execution Order:
Actions execute sequentially. If any action fails, entire proposal reverts.

[← Back]  [Review →]
```

**For Parameter Change Proposals:**
```
Parameter to Change
[Dropdown: Voting Period | Quorum | Proposal Threshold | Timelock Delay]

Current Value: 7 days
New Value: [5] days

Impact Analysis:
⚠ Decreasing voting period gives community less time to review proposals.
✓ Current participation rate: 12% - sufficient for 5 day voting.

[← Back]  [Review →]
```

**Step 4: Review & Submit**
```
Review Proposal
═══════════════════════════════════════
Title: Allocate 1000 DAI for Marketing Campaign
Type: Treasury Allocation
───────────────────────────────────────
Short Description:
Fund Q1 marketing initiatives to grow community...

Full Description:
[Markdown rendered preview]
───────────────────────────────────────
Actions:
1. Transfer 1,000 DAI to 0x742d...35Ce (marketing.eth)
═══════════════════════════════════════

Submission Requirements:
✓ Proposal threshold met (you hold 5,000 tokens, need 1,000)
✓ Wallet connected
✓ All required fields completed

Estimated Gas Cost: ~0.002 ETH ($5.40)

⚠ Important:
- Proposal cannot be edited after submission
- Voting will begin in 1 day (voting delay period)
- Voting will last for 7 days after delay

[← Back to Edit]  [Submit Proposal]
```

**Post-Submission:**
```
✅ Proposal Submitted Successfully!

Proposal #145 is now pending.
Voting will begin in approximately 23 hours 59 minutes.

Transaction: 0xabc...123 ✓
View on Etherscan

What's Next?
- Share your proposal with the community
- Answer questions in the discussion thread
- Monitor voting progress

[Share on Twitter]  [Copy Link]  [View Proposal]
```

**Validation & Error Handling:**
- Real-time field validation
- Clear error messages: "Must hold at least 1,000 tokens to create proposal"
- Pre-flight checks before transaction
- Gas estimation before submission
- Handle transaction failures gracefully

---

#### 5.3.3 Proposal Details & Voting Interface

**Proposal Detail Page Layout:**

**Header Section:**
```
┌─────────────────────────────────────────────────┐
│ [← Back to Proposals]     [Share ↗] [🔔 Watch]  │
│                                                  │
│ [STATUS: ACTIVE] Proposal #145                   │
│                                                  │
│ Allocate 1000 DAI for Marketing Campaign        │
│                                                  │
│ Created by: 0x742d...35Ce (marketing.eth)       │
│ Created: Oct 1, 2025 at 10:30 UTC              │
│ Voting Ends: Oct 8, 2025 at 10:30 UTC          │
│ ⏰ 3 days, 14 hours remaining                   │
└─────────────────────────────────────────────────┘
```

**Vote Panel (Sticky Sidebar):**
```
┌────────────────────────────┐
│ Cast Your Vote             │
│                            │
│ Your Voting Power          │
│ 5,000 votes                │
│ (5,000 tokens at snapshot) │
│                            │
│ [    Vote For    ]         │
│ [  Vote Against  ]         │
│ [    Abstain     ]         │
│                            │
│ Current Results            │
│                            │
│ ⬆ For: 45,000 (45%)       │
│ ⬇ Against: 30,000 (30%)   │
│ ⊝ Abstain: 25,000 (25%)   │
│                            │
│ Progress Bar:              │
│ ████████░░░░░░░░ 60%      │
│                            │
│ Quorum: 40,000 / 100,000  │
│ (4% required) ✓ Met       │
│                            │
│ Total Voters: 156          │
└────────────────────────────┘
```

**Main Content Area:**

**Tabs Navigation:**
```
[Description] [Actions] [Votes (156)] [Timeline] [Discussion]
```

**Description Tab:**
```
Proposal Description
═══════════════════════════════════════
[Rendered Markdown content with syntax highlighting]

Overview:
This proposal requests 1,000 DAI from the treasury to fund Q1 marketing 
initiatives aimed at growing our community and increasing protocol awareness.

Goals:
• Launch targeted social media campaigns
• Sponsor 3 community events
• Create educational content series
• Partner with influencers in the Web3 space

Expected Outcomes:
• 30% increase in community members
• 50% increase in social media engagement
• 10+ pieces of educational content published

Budget Breakdown:
- Social Media Ads: 400 DAI
- Event Sponsorships: 300 DAI
- Content Creation: 200 DAI
- Influencer Partnerships: 100 DAI

Timeline: Q1 2026 (Jan - Mar)

Success Metrics:
[Table rendered from markdown]
```

**Actions Tab:**
```
On-Chain Actions
═══════════════════════════════════════

If this proposal passes, the following actions will be executed 
automatically after a 2-day timelock delay:

Action 1: Transfer ERC20 Token
┌─────────────────────────────────────┐
│ Target Contract:                     │
│ 0x6B17...D4eF (DAI Stablecoin)      │
│ [View on Etherscan ↗]               │
│                                      │
│ Function: transfer(address,uint256)  │
│                                      │
│ Parameters:                          │
│ • recipient: 0x742d...35Ce          │
│   (marketing.eth) ✓ Verified        │
│ • amount: 1,000 DAI                 │
│                                      │
│ Current Treasury Balance: 100,000    │
│ Balance After: 99,000 (-1%)         │
└─────────────────────────────────────┘

⚠ Security Check: All actions verified
✓ No suspicious contract interactions
✓ Recipient address has transaction history
✓ Amount within reasonable limits (<5% treasury)
```

**Votes Tab:**
```
Voting Activity (156 voters)
═══════════════════════════════════════

Filter: [All] [For] [Against] [Abstain]
Sort: [Most Recent ▼]

┌──────────────────────────────────────────┐
│ 0xabc...def (alice.eth)                   │
│ Voted: For | Power: 10,000 votes         │
│ Oct 5, 2025 at 14:23 UTC                 │
│ Transaction: 0x123...abc ↗               │
│                                          │
│ Reason: "This will help grow our         │
│ community significantly..."              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 0x123...789 (bob.eth)                    │
│ Voted: Against | Power: 5,000 votes      │
│ Oct 5, 2025 at 12:15 UTC                │
│ Transaction: 0x456...def ↗               │
│                                          │
│ Reason: "Budget seems too high for Q1"   │
└──────────────────────────────────────────┘

[Load More]

Export Votes: [CSV] [JSON]
```

**Timeline Tab:**
```
Proposal Timeline
═══════════════════════════════════════

✅ Oct 1, 10:30 UTC - Proposal Created
   By: 0x742d...35Ce
   Tx: 0xabc...123 ↗

⏳ Oct 2, 10:30 UTC - Voting Begins
   Voting delay period ends

🎯 Oct 9, 10:30 UTC - Voting Ends
   7-day voting period

📊 Oct 9, 10:31 UTC - Results Tallied
   If passed: Queued in Timelock

⏰ Oct 11, 10:31 UTC - Execution Available
   2-day timelock delay

⚡ Oct 25, 10:31 UTC - Execution Deadline
   14-day grace period expires
```

**Discussion Tab:**
```
Community Discussion
═══════════════════════════════════════

💬 23 Comments

[Connect Wallet to Comment]

Sort by: [Most Recent ▼]

─────────────────────────────────────

👤 alice.eth • Oct 3, 2025
Voted: For

Great proposal! The budget breakdown is clear and the goals are 
achievable. I'd love to see quarterly updates on progress.

  💬 Reply  👍 12  👎 0

  └─ 👤 marketing.eth • Oct 3, 2025
     Thanks Alice! We'll definitely provide monthly updates in the 
     community calls.
     
     💬 Reply  👍 5  👎 0

─────────────────────────────────────

👤 bob.eth • Oct 4, 2025
Voted: Against

While I support marketing, 1,000 DAI seems high. Can we start with 
500 DAI and evaluate before allocating more?

  💬 Reply  👍 8  👎 3

[Load More Comments]
```

**Voting Modal (When User Clicks Vote Button):**
```
┌────────────────────────────────────┐
│ Confirm Your Vote                  │
│                                    │
│ Proposal #145                      │
│ Allocate 1000 DAI for Marketing... │
│                                    │
│ Your Vote: FOR                     │
│ Voting Power: 5,000 votes          │
│                                    │
│ Add a reason (optional):           │
│ [                                ] │
│ [                                ] │
│ Public comment explaining your vote│
│                                    │
│ ⚠ Important:                       │
│ • Your vote is public and final    │
│ • You can change your vote before  │
│   voting ends (overwrites previous)│
│ • Gas cost: ~0.001 ETH (~$2.70)   │
│                                    │
│ [Cancel]  [Confirm Vote]           │
└────────────────────────────────────┘
```

**After Voting - Success State:**
```
✅ Vote Submitted Successfully!

Your vote "FOR" has been recorded on-chain.

Transaction: 0xdef...456 ✓
View on Etherscan

Vote Power: 5,000 votes
Block: 18,245,123

Updated Results:
For: 50,000 (48%) ← +5,000
Against: 30,000 (29%)
Abstain: 25,000 (23%)

[Share Your Vote] [Back to Proposal]
```

---

#### 5.3.4 Treasury Dashboard

**Treasury Overview Page:**

**Header Stats:**
```
┌──────────────────────────────────────────────┐
│ Treasury Overview                             │
│                                               │
│ Total Value: $2,458,930.42                   │
│ 24h Change: +$12,450 (+0.51%) ↗              │
│                                               │
│ Assets: 12 | Transactions: 847               │
└──────────────────────────────────────────────┘
```

**Asset Breakdown:**
```
Assets Holdings
═══════════════════════════════════════

Search: [         ] Filter: [All ▼]

┌─────────────────────────────────────────────┐
│ ETH (Ethereum)                               │
│ Balance: 450.25 ETH                          │
│ Value: $1,125,625.00 (45.8% of treasury)    │
│ 24h: +2.3% ↗                                 │
│ [Send] [View Transactions]                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ DAI (Dai Stablecoin)                         │
│ Balance: 500,000 DAI                         │
│ Value: $500,000.00 (20.3% of treasury)      │
│ 24h: 0.0%                                    │
│ [Send] [View Transactions]                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ USDC (USD Coin)                              │
│ Balance: 300,000 USDC                        │
│ Value: $300,000.00 (12.2% of treasury)      │
│ 24h: +0.1% ↗                                 │
│ [Send] [View Transactions]                   │
└─────────────────────────────────────────────┘

[View All Assets (12)]
```

**Recent Transactions:**
```
Recent Treasury Activity
═══════════════════════════════════════

┌─────────────────────────────────────────────┐
│ ✅ Executed                                  │
│ Proposal #142: Developer Grant Q4            │
│ Oct 1, 2025 • 50,000 DAI                    │
│ To: 0xdev...abc (dev-team.eth)              │
│ [View Details ↗]                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⏳ Pending Execution                         │
│ Proposal #145: Marketing Campaign            │
│ Executes in: 1 day 14 hours                 │
│ Amount: 1,000 DAI                            │
│ [View Proposal]                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📥 Received                                  │
│ Token Swap Revenue                           │
│ Sep 28, 2025 • 25 ETH                       │
│ From: 0xprotocol...xyz                       │
│ [View Transaction ↗]                         │
└─────────────────────────────────────────────┘

[View All Transactions]
```

**Treasury Analytics:**
```
[30 Days] [90 Days] [1 Year] [All Time]

Balance Over Time:
[Line chart showing treasury value over selected period]

Spending by Category:
[Pie chart: Development 40% | Marketing 25% | Operations 20% | 
 Grants 10% | Other 5%]

Monthly Burn Rate: $45,000
Runway: 54 months at current rate
```

---

#### 5.3.5 Analytics Dashboard

**Governance Analytics Page:**

**Key Metrics (Top Cards):**
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Total Proposals  │ │ Participation    │ │ Success Rate     │
│      156         │ │      12.4%       │ │      68%         │
│  +12 this month  │ │  ↗ +2.1% vs avg  │ │  ↘ -5% vs avg   │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Active Voters    │ │ Avg Vote Time    │ │ Treasury Value   │
│     2,845        │ │    3.2 days      │ │   $2.45M         │
│  +156 this month │ │  4.8 day period  │ │  ↗ +5.2%        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Proposal Trends:**
```
Proposals Over Time
[Line/Bar combo chart showing proposal volume and success rate]

Filters: [6 Months ▼] [All Types ▼]
```

**Voter Engagement:**
```
Voter Participation Trends
[Stacked area chart showing active voters, votes cast, unique voters]

Top Voters (by voting power used):
1. alice.eth - 450 proposals voted
2. bob.eth - 389 proposals voted
3. charlie.eth - 312 proposals voted
[View Full Leaderboard]

Voting Power Distribution:
[Histogram showing concentration of voting power]
• Top 10 holders: 35% of voting power
• Top 100 holders: 72% of voting power
• All others: 28% of voting power
```

**Proposal Performance:**
```
Proposal Outcomes
═══════════════════════════════════════

Total: 156 proposals

Executed: 106 (68%) ✅
Failed: 42 (27%) ❌
Canceled: 8 (5%) 🚫

Average Time to Execution: 11.3 days
- Voting Delay: 1 day
- Voting Period: 7 days
- Timelock: 2 days
- Queue to Execute: 1.3 days avg

By Category:
Treasury: 58 proposals (75% success)
Parameter: 32 proposals (84% success)
Development: 28 proposals (64% success)
Marketing: 18 proposals (61% success)
Other: 20 proposals (55% success)
```

**Export & API Access:**
```
Data Export
[CSV] [JSON] [Excel]

API Access for Developers:
GraphQL Endpoint: https://api.dgp.xyz/graphql
REST API: https://api.dgp.xyz/v1/
[View API Documentation]
```

---

#### 5.3.6 User Profile & Settings

**User Profile Page:**

**Profile Header:**
```
┌────────────────────────────────────────────┐
│ 👤 alice.eth                                │
│ 0xabc...def                                 │
│ [Copy Address] [View on Explorer ↗]        │
│                                             │
│ Member Since: Jan 15, 2025                  │
│ Proposals Created: 8                        │
│ Votes Cast: 142                             │
└────────────────────────────────────────────┘
```

**Voting Stats:**
```
Your Voting Activity
═══════════════════════════════════════

Current Voting Power: 10,000 votes
Voting Weight: 0.5% of total supply

Participation Rate: 91.2%
(Voted on 142 of 156 proposals)

Voting History:
For: 98 (69%)
Against: 32 (23%)
Abstain: 12 (8%)

[View Detailed History]
```

**Your Proposals:**
```
Proposals You Created
═══════════════════════════════════════

┌────────────────────────────────────────────┐
│ ✅ #132: Increase Development Budget        │
│ Created: Sep 15, 2025 | Status: Executed   │
│ Result: Passed (72% For)                    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ❌ #118: Change Quorum to 2%                │
│ Created: Aug 20, 2025 | Status: Failed     │
│ Result: Failed (38% For, quorum not met)   │
└────────────────────────────────────────────┘

[View All (8)]
```

**Settings Panel:**
```
Account Settings
═══════════════════════════════════════

Notifications:
□ Email me when voting starts on new proposals
□ Email me when my proposals change status
□ Email me 1 day before voting ends
□ Weekly governance summary

Email: [alice@example.com] [Update]

Display Settings:
Theme: [Auto ▼] (Light | Dark | Auto)
Default View: [Active Proposals ▼]
Items Per Page: [20 ▼]

Privacy:
○ Public Profile (anyone can view)
○ Private Profile (only show on-chain data)

Data Export:
Download all your governance data
[Request Data Export]

Danger Zone:
[Disconnect Wallet]
```

---

#### 5.3.7 Wallet Integration

**Supported Wallets:**
- MetaMask (Browser Extension & Mobile)
- WalletConnect v2 (All compatible wallets)
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- Ledger (via WalletConnect)
- Trezor (via WalletConnect)

**Wallet Connection Flow:**
```
1. User clicks "Connect Wallet"
2. Modal shows wallet options
3. User selects wallet
4. Wallet prompts for connection approval
5. After approval, show network check
6. If wrong network, prompt to switch
7. Connection successful, show user info
```

**Connection Modal:**
```
┌────────────────────────────────────┐
│ Connect Your Wallet                 │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  🦊 MetaMask                 │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  🌈 WalletConnect           │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  🔵 Coinbase Wallet         │   │
│ └─────────────────────────────┘   │
│                                     │
│ [Show More Options]                 │
│                                     │
│ By connecting, you agree to our     │
│ Terms of Service                    │
└────────────────────────────────────┘
```

**Network Switching:**
```
⚠ Wrong Network Detected

This DAO operates on Polygon.
You're currently connected to Ethereum.

[Switch to Polygon Network]

Supported Networks:
✓ Polygon
✓ Ethereum
✓ Arbitrum
✓ Optimism
✓ Base
```

**Transaction States:**
```
Transaction Flow:
1. Pending User Signature
   "Please confirm in your wallet..."
   [Spinning loader]

2. Transaction Submitted
   "Transaction submitted to network..."
   Tx: 0xabc...123 [View ↗]

3. Confirming (Block Confirmations)
   "Waiting for confirmations... (1/3)"
   [Progress bar]

4. Success
   "Transaction confirmed! ✅"
   [Success animation]

Error Handling:
- User Rejected: "Transaction canceled by user"
- Insufficient Gas: "Insufficient ETH for gas. Please add funds."
- Transaction Failed: "Transaction failed. [View Details]"
- Network Error: "Network error. Please try again."
```

---

#### 5.3.8 Responsive Design & Mobile Experience

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile-Specific Features:**
- Bottom navigation bar (proposals, create, treasury, profile)
- Swipeable proposal cards
- Simplified voting interface
- Touch-optimized buttons (min 44x44px)
- Pull-to-refresh on proposal list
- Optimized modals (full-screen on mobile)

**Mobile Navigation:**
```
┌────────────────────────────┐
│ [☰] DGP    [@] [🔔] [👤]   │ <- Top Bar
│                             │
│                             │
│   [Proposal Content]        │
│                             │
│                             │
│                             │
│                             │
│                             │
│ [📋] [+] [💰] [📊] [👤]    │ <- Bottom Nav
└────────────────────────────┘
```

**Progressive Web App (PWA):**
- Installable on mobile home screen
- Offline proposal viewing (cached data)
- Push notifications for proposal updates
- App-like experience on mobile

---

### 5.4 Subgraph & Data Layer

#### 5.4.1 Subgraph Architecture

**Purpose:**
Fast, efficient querying of governance data without hitting blockchain RPC directly

**Indexed Events:**
```graphql
# Core Events
- ProposalCreated
- VoteCast
- ProposalCanceled
- ProposalExecuted
- ProposalQueued

# Treasury Events  
- Transfer (ETH/ERC20)
- Approval (ERC20)

# Governance Events
- VotingDelaySet
- VotingPeriodSet
- ProposalThresholdSet
- QuorumNumeratorUpdated

# Access Control Events
- RoleGranted
- RoleRevoked
```

**Schema Entities:**
```graphql
type Governance @entity {
  id: ID!
  totalProposals: BigInt!
  totalVotes: BigInt!
  totalVoters: BigInt!
  proposalCount: BigInt!
  proposals: [Proposal!]! @derivedFrom(field: "governance")
}

type Proposal @entity {
  id: ID! # proposalId
  proposalId: BigInt!
  proposer: Bytes!
  targets: [Bytes!]!
  values: [BigInt!]!
  calldatas: [Bytes!]!
  startBlock: BigInt!
  endBlock: BigInt!
  description: String!
  status: ProposalStatus!
  forVotes: BigInt!
  againstVotes: BigInt!
  abstainVotes: BigInt!
  votes: [Vote!]! @derivedFrom(field: "proposal")
  createdAt: BigInt!
  executedAt: BigInt
  canceledAt: BigInt
  queuedAt: BigInt
  eta: BigInt
  governance: Governance!
}

enum ProposalStatus {
  Pending
  Active
  Canceled
  Defeated
  Succeeded
  Queued
  Expired
  Executed
}

type Vote @entity {
  id: ID! # proposalId-voter
  proposal: Proposal!
  voter: Bytes!
  support: Int! # 0=Against, 1=For, 2=Abstain
  weight: BigInt!
  reason: String
  timestamp: BigInt!
  transaction: Bytes!
}

type Voter @entity {
  id: ID! # voter address
  address: Bytes!
  proposals: [Vote!]! @derivedFrom(field: "voter")
  votesCount: BigInt!
  proposalsCreated: [Proposal!]! @derivedFrom(field: "proposer")
}

type Treasury @entity {
  id: ID!
  address: Bytes!
  ethBalance: BigInt!
  tokens: [TokenBalance!]! @derivedFrom(field: "treasury")
  transactions: [Transaction!]! @derivedFrom(field: "treasury")
}

type TokenBalance @entity {
  id: ID! # treasury-tokenAddress
  treasury: Treasury!
  token: Bytes!
  balance: BigInt!
  symbol: String
  decimals: Int
}

type Transaction @entity {
  id: ID! # txHash-logIndex
  treasury: Treasury!
  type: String! # "deposit" | "withdrawal"
  token: Bytes!
  amount: BigInt!
  from: Bytes!
  to: Bytes!
  timestamp: BigInt!
  proposal: Proposal
}
```

**GraphQL Queries Examples:**
```graphql
# Get active proposals
query ActiveProposals {
  proposals(
    where: { status: Active }
    orderBy: endBlock
    orderDirection: asc
  ) {
    id
    proposalId
    description
    forVotes
    againstVotes
    abstainVotes
    endBlock
    proposer
  }
}

# Get user's voting history
query UserVotes($address: Bytes!) {
  voter(id: $address) {
    votesCount
    proposals(orderBy: timestamp, orderDirection: desc) {
      proposal {
        id
        description
        status
      }
      support
      weight
      timestamp
    }
  }
}

# Get governance statistics
query GovernanceStats {
  governance(id: "1") {
    totalProposals
    totalVotes
    totalVoters
  }
}

# Get proposal details with votes
query ProposalDetails($id: ID!) {
  proposal(id: $id) {
    proposalId
    proposer
    description
    status
    forVotes
    againstVotes
    abstainVotes
    startBlock
    endBlock
    votes(orderBy: timestamp, orderDirection: desc) {
      voter
      support
      weight
      reason
      timestamp
    }
  }
}
```

**Deployment:**
- Hosted Service: The Graph Hosted Service (development)
- Decentralized Network: The Graph Network (production)
- Update frequency: Real-time (new blocks)
- Historical data: Full history from deployment block

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Next.js    │  │  React UI    │  │  Tailwind   │  │
│  │   Frontend   │  │  Components  │  │     CSS      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Ethers.js  │  │  RainbowKit  │  │    Wagmi     │  │
│  │   /Viem      │  │   Wallet     │  │    Hooks     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                    Data Layer                            │
│  ┌────────────────────────┐  ┌─────────────────────┐   │
│  │   The Graph Subgraph   │  │   IPFS (Metadata)   │   │
│  │   (Historical Data)    │  │   (Descriptions)    │   │
│  └────────────────────────┘  └─────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                  Blockchain Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Governor   │  │   Timelock   │  │   Treasury   │  │
│  │   Contract   │  │  Controller  │  │   Contract   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Voting Token│  │    Proxy     │                    │
│  │   ERC20/721  │  │   (UUPS)     │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│              EVM-Compatible Blockchain                   │
│  (Ethereum, Polygon, Arbitrum, Optimism, Base, etc.)    │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Technology Stack

#### 6.2.1 Smart Contracts
```
Language: Solidity ^0.8.20
Framework: Hardhat 2.19+
Libraries:
  - OpenZeppelin Contracts 5.0+
    - Governor
    - Timelock Controller
    - ERC20Votes
    - AccessControl
    - UUPS Proxies
  - OpenZeppelin Contracts Upgradeable

Development Tools:
  - Hardhat
  - Hardhat Deploy
  - Hardhat Gas Reporter
  - Hardhat Coverage
  - Hardhat Contract Sizer
  - Solhint (Linting)
  - Prettier Solidity (Formatting)

Testing:
  - Chai (Assertions)
  - Waffle (Ethereum-specific matchers)
  - Hardhat Network (Local blockchain)
  - Hardhat Forking (Mainnet simulation)
```

#### 6.2.2 Frontend Application
```
Framework: Next.js 14+ (App Router)
Language: TypeScript 5.0+
UI Library: React 18+

Styling:
  - Tailwind CSS 3.4+
  - Headless UI (Accessible components)
  - Radix UI (Complex components)
  - Framer Motion (Animations)

Web3 Libraries:
  - Wagmi 2.0+ (React hooks for Ethereum)
  - Viem 2.0+ (Ethereum interactions)
  - RainbowKit 2.0+ (Wallet connection)
  - ethers.js 6.0+ (Fallback)

State Management:
  - React Context (Global state)
  - Zustand (Complex state)
  - TanStack Query (Server state, caching)

Forms & Validation:
  - React Hook Form
  - Zod (Schema validation)

Markdown:
  - React Markdown
  - Remark GFM
  - Syntax highlighting

Charts & Visualization:
  - Recharts
  - D3.js (Custom visualizations)

Utilities:
  - date-fns (Date manipulation)
  - numeral.js (Number formatting)
  - clsx / tailwind-merge (Class management)
```

#### 6.2.3 Data & Indexing
```
Indexing: The Graph Protocol
Subgraph SDK: @graphprotocol/graph-cli
Query Client: Apollo Client / urql

Storage:
  - IPFS (Proposal metadata, descriptions)
  - Pinata / Web3.Storage (IPFS pinning)

Analytics:
  - Dune Analytics (On-chain analytics