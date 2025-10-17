# Frontend Application Specification for DAO Management DApp
This document outlines the proposed frontend architecture, screens, and user flows for a decentralized application (DApp) that interacts with the provided smart contract suite for DAO creation and management.

## 1. Detailed screen breakdown (number of screens + purpose)

11 proposed main screens (plus reusable dialogs / modals). 
Each screen includes required components, data sources (on-chain calls), actions, and access control notes.

### Landing Page (1 screen)
User onboarding and gives information about the app features and how to use it.

### Home Page (1 screen)
- Purpose: High-level entry to the app, discover DAOs, links to create or manage DAOs, onboarding/learn.

- Visible components:
  - Header: Connect Wallet, user address, network indicator.
  - Search / Filter bar: search by DAO name, token type (ERC20 / ERC721), creator address.
  - DAO list/grid: each card shows daoName, short description, token type, createdAt, token address, governor address, treasury ETH balance (quick fetch).
  - Create DAO CTA (prominent).

- Data / contract calls:
  - `GovernorFactory.getDaoCount()` (optional)
  - `GovernorFactory.getAllDaos()` to populate list (if large, add pagination or indexer).
  - For each DAO display: call `DGPTreasury.getETHBalance()` and optionally `getTokenBalance(token)` if you want token balance.

- Actions:
  - Click DAO card -> DAO Dashboard (screen 2).
  - Click Create DAO -> Create DAO screen (screen 3 (wizard)).
  
- Access control: anyone can view.

### DAO Dashboard / Overview (1 screen per DAO)
- Purpose: Single-page hub for a DAO with tabs (Overview, Treasury, Proposals, Members, Token, Admin).

- Top area:
  - DAO name, metadata (from `DAOConfig.metadataURI` or `daoDescription`), creator, createdAt.
  - Addresses: Governor, Timelock, Treasury, Token (copy to clipboard).
  - Quick stats: ETH in treasury, token totalSupply or total NFTs, member count, active proposals count, quorum percentage.

- Tabs (each opens sub-area on same screen):
  - Overview (default): summary + latest proposals feed + recent activity (events from factory/governor).
  - Proposals: list + create button.
  - Treasury: balances, pending withdrawals (via proposals), withdraw CTA for admin via proposal creation.
  - Members: list of members, voting power, add/remove member controls (owner-only).
  - Token: token details, minting (if you are minter/admin), transfer link.
  - Admin: advanced settings (timelock delay, role management) — owner/admin only.

- Data / contract calls:
  - `GovernorFactory.getDao(daoId)` or `getAllDaos()` then filter for the current DAO.
  - `DGPGovernor.quorumPercentage()` for quorum.
  - `DGPGovernor.listMembers()` for member list (owner-only).
  - `ERC20VotingPower.totalSupply()` / `ERC721VotingPower.totalSupply()` etc.
  - `DGPTreasury.getETHBalance()` and `getTokenBalance(token)` for treasury balances.
  - `DGPGovernor.getProposalMetadata(proposalId)` for detailed proposal metadata.
  - Governor contract: `getVotes`, `propose`, `castVote`, `state`, `proposalSnapshot`, `proposalDeadline`, `proposalVotes` etc. (OpenZeppelin Governor interface).

- Actions:
  - Create proposal -> Proposal creation flow (screen 4 or modal).
  - Add member / batch add -> modal with addresses + voting power (owner-only; call `addMember` / `batchAddMembers`).
  - Mint voting power -> call `mintVotingPower` (owner-only) or via token contract `mint` if you have MINTER_ROLE.
  - Execute queued proposals -> "Execute" button which calls timelock (anyone if executor is address(0)).
  - Transfer token ownership -> call `transferOwnership(newOwner)` (owner-only). Optional

- Access control: tab-level restrictions for owner-only features.

### Create DAO (multi-step wizard) (1 screen with multiple steps)
- Purpose: Create a new DAO using `GovernorFactory.createDAO`.

- Steps:
  1. Basic info: daoName, daoDescription, metadataURI (optional).
  2. Token config: choose token type (ERC20/ERC721), tokenName, tokenSymbol, initialSupply (ERC20), maxSupply, baseURI (ERC721), initial distribution options (mint to creator).
  3. Governance params: votingDelay (blocks), votingPeriod (blocks), proposalThreshold, timelockDelay (secs; enforcement: must be >= 1 day), quorum percentage.
  4. Review & deploy: show gas estimates, confirm wallet signature, transaction to call `createDAO(...)`.
- Contract calls:
  - `GovernorFactory.createDAO(...)`.
- Post-deploy:
  - Show addresses returned (governor, timelock, treasury, token), link to DAO Dashboard.
- UX notes:
  - Validate parameters client-side (e.g., quorum 1-100, timelock >= 1 day).
  - Show expected roles and security notes (timelock will allow anyone to execute queued actions if factory configured so).
- Access control: user must be connected to wallet to pay gas.

4) Proposal Creation (rich metadata) (Modal or dedicated screen)
- Purpose: Create on-chain proposal via `DGPGovernor.proposeWithMetadata`.
- Fields:
  - Targets[] (contract addresses) — UI helper: "Call Treasury withdraw ETH", "Call Treasury withdrawToken", "Call token.mint(...)", or custom contract call builder (advanced).
  - Values[] (ETH to send)
  - Calldatas[] (ABI-encoded calls) — provide UX-first builders for common actions:
    - Treasury: withdrawETH(recipient, amount)
    - Treasury: withdrawToken(tokenAddress, recipient, amount)
    - Token: mint(to, amount) or batchMint
    - Timelock role changes: grantRole/revokeRole (advanced)
  - Title (string)
  - Description (long text)
  - proposalType, proposedSolution, rationale, expectedOutcomes, timeline, budget (from metadata struct)
- Client-side:
  - Let user build one or multiple actions in the proposal.
  - Show preview of on-chain calls (addresses + function signatures).
- Contract call:
  - `DGPGovernor.proposeWithMetadata(targets, values, calldatas, title, description, ...)`
- Post-create:
  - Show transaction hash and waiting for proposal to enter Active (after votingDelay blocks). Provide link to proposal page.
- Access control:
  - Must have tokens >= proposalThreshold (or trust governor will reject on-chain, but can do client-side check via `DGPGovernor.proposalThreshold()`).
- UX: Make it clear proposer's address cannot vote on their own proposal.

5) Proposal Details + Voting (1 screen per proposal)
- Purpose: Show full proposal metadata, call list, state, votes, voting UI and timeline.
- Top area:
  - Title, proposer, timestamp, status (Draft/Active/Passed/Failed/Queued/Executed).
  - Metadata fields: proposalType, proposedSolution, rationale, expectedOutcomes, timeline, budget.
- Call list:
  - Show each target address + function signature + arguments + ETH value.
- Voting status:
  - ForVotes, AgainstVotes, quorumReachedPct (uses `getProposalMetadata`).
  - Voting start block (snapshot) and end block (deadline) via `proposalSnapshot` and `proposalDeadline`.
  - Current Open/Closed state via `DGPGovernor.state(proposalId)`.
- Voting UI:
  - If Active: show three options (For, Against, Abstain) and optional reason field. Use `castVoteWithReason` if including reason; else `castVote`.
  - Disable vote if msg.sender == proposer (contract forbids creator from voting).
  - Show user's voting power (call `votingToken.getVotes(address)` or `getPastVotes` at snapshot block).
- Queue/Execute:
  - If Succeeded: allow queuing (if governance requires queue) — this may be automatic inside governor. Provide button to queue (call governor queue methods; often require Governor to schedule the call through timelock). If already queued and delay passed: show Execute button to call governor.execute or timelock.execute as appropriate; if executor role is address(0), anyone may execute.
  - Show timelock ETA and remaining time.
- Events / history:
  - Show list of state transitions, ballot records (optionally fetch `VoteCast` events).
- Data / contract calls:
  - `DGPGovernor.getProposalMetadata(proposalId)`
  - `DGPGovernor.state(proposalId)`, `proposalSnapshot(proposalId)`, `proposalDeadline(proposalId)`, `proposalVotes(proposalId)`
  - `votingToken.getPastVotes(account, snapshot)`, `votingToken.getVotes(account)` depending on token type
  - `DGPGovernor.castVote` / `castVoteWithReason`
  - `GovernorTimelockControl` queue and execute flows (may be wrapped by Governor methods)
- Edge cases:
  - If the token is ERC721, voting power per token matters (voters need to own NFTs).
  - If proposals have multiple calldatas, ensure correct ordering and display.
- Access control: Anyone can view. Voting only if you hold voting tokens and it's Active; proposers cannot vote.

6) Members Management (sub-screen under DAO) (1 screen / tab)
- Purpose: Admin-only page to manage member list and mint voting power.
- Features:
  - List of members: address, current voting power, member status.
  - Add member: single or batch add addresses + mint amounts -> calls `addMember` or `batchAddMembers`.
  - Remove member: owner-only `removeMember`.
  - Mint voting power: `mintVotingPower(to, amount)` for owner to top-up members.
- Data / contract calls:
  - `DGPGovernor.listMembers()`, token contract `balanceOf(address)` for each member.
  - `DGPGovernor.addMember`, `batchAddMembers`, `removeMember`, `mintVotingPower`.
- Access control: only owner/admin (check via `DGPGovernor.owner()` or by checking whether current address equals owner).

7) Token Details & Minting (1 screen / tab)
- Purpose: Show token details and actions for minters/admins.
- Data:
  - If ERC20: name, symbol, totalSupply, maxSupply, token address, balanceOf current user.
  - If ERC721: totalSupply, maxSupply, baseURI, list of owned tokenIds (call `tokenOfOwnerByIndex` if available or index via events).
- Actions:
  - Mint (if user has MINTER_ROLE): token.mint(to, amount) or batchMint.
  - Set baseURI (ERC721 admin-only).
  - Transfer tokens (user wallet interactions via standard token transfer).
- Contract calls:
  - `ERC20VotingPower.mint`, `batchMint`, `setMinter` (admin)
  - `ERC721VotingPower.mint`, `batchMint`, `setMinter`, `setBaseURI`
- UI notes:
  - Show role check: use `ERC20/721.hasRole(MINTER_ROLE, address)`, and `hasRole(DEFAULT_ADMIN_ROLE, address)`. Access via contract `hasRole(bytes32 role, address account)` (ABI call).
- Access control: actions available only to addresses with correct roles.

8) Treasury (1 screen / tab)
- Purpose: Show ETH and token balances and recent received events; also show how to propose withdrawals.
- Data:
  - `DGPTreasury.getETHBalance()`
  - `DGPTreasury.getTokenBalance(token)` for known tokens
  - Treasury receive events (listen to `ETHReceived` events)
- Actions:
  - The treasury withdraw functions are only callable by timelock; the UI should not directly call `withdrawETH` — instead, guide admin to create a proposal that calls treasury.withdrawETH or withdrawToken. Provide buttons to build these withdrawal calls into a proposal.
  - If a proposal that withdraws has been executed, show executed amounts.
- UX:
  - Present common withdraw template: recipient address, amount (with max), token selector.
  - Provide safety checks: show treasury balance and warn when requested amount exceeds balance.
- Access control: withdraw must be via proposals queued/executed by timelock; only show "Create withdraw proposal" option to proposer-eligible addresses (or any address; governor will reject if not permitted).

9) Proposal Execution & Timelock Queue Page (1 screen / area)
- Purpose: Show queued proposals, ETA, and include Execute button when delay expired.
- Data:
  - Use `DGPGovernor.proposalNeedsQueuing` / `state` to detect queued proposals; Timelock events show queued operations with their scheduled timestamps.
  - Show ETA (queue timestamp + minDelay). The timelock contract has events (CallScheduled, CallExecuted).
- Actions:
  - Execute queued call(s) — call `timelock.execute(...)` or Governor wrapper `execute`.
  - Cancel (if allowed) — governor may support cancel.
- Access control: may be executable by anyone if executor role = address(0), otherwise only allowed executors.

10) DAO Admin / Roles & Settings (1 screen / tab)
- Purpose: For owner: manage the timelock admin role, change governor params, and other admin-only checks.
- Visible items:
  - Timelock minDelay view (not directly modifiable on chain except via admin roles).
  - Role management UI: display current role holders (PROPOSER_ROLE, EXECUTOR_ROLE, DEFAULT_ADMIN_ROLE).
  - Buttons to propose role changes via governor/timelock (advanced).
- Contract calls:
  - `timelockContract.hasRole(role, addr)`, `timelockContract.getRoleMemberCount` if implemented (TimelockController uses AccessControl so has `getRoleMemberCount`).
  - `DGPGovernor.quorumPercentage()` (show current).
  - `DGPGovernor.proposalThreshold()` and ability to propose adjustments (governor settings are changeable only by owner or via governance depending on implementation).
- Access control: owner-only features.

11) User Profile / Wallet Dashboard (1 screen)
- Purpose: For connected user: show their DAOs involvement, tokens held, vote history.
- Data:
  - `GovernorFactory.getDaosByCreator(address)` to show created DAOs.
  - Scan known DAOs for `votingToken.balanceOf(user)` or use events to compute contributions/membership.
  - Vote history via `VoteCast` events filtered by user address across governors (indexer recommended).
- Actions:
  - Quick links to DAO dashboards, pending votes, proposals to vote on.
- UX:
  - Show notifications: proposals awaiting user's vote, queued proposals ready to execute, treasury requests.

Shared UI pieces & modals (reusable)
- Connect Wallet modal (MetaMask / WalletConnect)
- Confirm transaction modal (gas estimate)
- Propose call builder (for building call target + function + args)
- Add Member / Batch Add Member modal
- Mint Token modal
- Proposal preview modal
- Role check & instructions modal (explains permissions & next steps)

Routing & navigation
- Routes:
  - / — Landing/Home
  - /daos — DAOs list (alias to home with filters)
  - /dao/[governorAddress] — DAO Dashboard
  - /dao/[governorAddress]/proposals — Proposals list
  - /dao/[governorAddress]/proposal/[proposalId] — Proposal details
  - /dao/[governorAddress]/members — Members management
  - /create-dao — Create DAO wizard
  - /profile — User profile

Data and backend considerations
- On-chain RPC only is possible but:
  - For lists (all DAOs, proposals, votes) a direct contract call is possible for DAOs (factory returns array), but proposals and votes across many governors may need an indexer (TheGraph) for good UX.
  - Proposal events: use Governor events (ProposalCreated, VoteCast, ProposalQueued, ProposalExecuted). Without an indexer, frontend can read events via provider.getLogs but this is slow for many DAOs; consider adding a light server or TheGraph subgraph later.
- For token metadata (ERC721 baseURI), fetch tokenURI via the token contract.

Edge cases and UX defensive checks
- Proposer cannot vote on own proposal (enforce in UI and show message).
- Time-based values: votingDelay and votingPeriod in blocks — translate to estimated time using average block time for the network; show both block counts and friendly durations.
- Token types: handle both ERC20 and ERC721 tokens gracefully.
- Role & permission errors: show human-friendly error messages when a transaction reverts (e.g., "Only owner may add members").
- Handling large DAO lists: add pagination or search; avoid loading all DAOs if `getAllDaos` returns thousands.
- Offline operations: let proposers prepare calldatas and save drafts locally.

Minimal contract call list for frontend devs (per screen)
- Factory:
  - getAllDaos(), getDao(daoId), createDAO(...)
  - getDaosByCreator(address)
- Governor:
  - proposeWithMetadata(...), propose(...), state(proposalId), proposalSnapshot, proposalDeadline
  - getProposalMetadata(proposalId)
  - castVote, castVoteWithReason, listMembers, addMember, batchAddMembers, removeMember, mintVotingPower
  - quorumPercentage(), proposalThreshold()
- Timelock:
  - ROLE checks: hasRole(role, address), grantRole/revokeRole (via proposals)
  - Execute / queue related functions (timelock.execute, timelock.schedule; use GovernorTimelockControl wrappers)
- Treasury:
  - getETHBalance(), getTokenBalance(token)
  - withdrawETH(recipient, amount) and withdrawToken(token, recipient, amount) — only via timelock proposals
- Tokens:
  - ERC20: mint, batchMint, balanceOf, totalSupply, maxSupply, hasRole
  - ERC721: mint, batchMint, totalSupply, maxSupply, setBaseURI, tokenURI, hasRole

Wireframe & component guidance (visual)
- Design topbar with wallet connect & network, main nav with DAOs / Create DAO / Profile
- DAO card: left column token icon, middle DAO name & description, right quick stats & buttons
- Proposal list: table or timeline with badges for state (Active/Queued/Executed/Failed)
- Proposal page: left column details (metadata + calls), right column votes & actions
- Use copy-to-clipboard for all addresses; add Etherscan/Block explorer links

Testing & dev checklist (priority order)
1. Integrate wallet connection (wagmi / ethers.js). Ensure network is set to the network where factory is deployed.
2. Build DAO list page using `getAllDaos`. Verify entries match on-chain.
3. Implement Create DAO wizard and test on local / testnet using factory.
4. Implement DAO Dashboard showing treasury & token details.
5. Implement Proposal creation using `proposeWithMetadata` with a simple treasury withdraw call.
6. Implement voting UI and ensure votes are correctly recorded and shown (test with multiple accounts).
7. Implement queue/execute flow simulation (timelock delay must be respected; for tests, reduce delay on local).
8. Implement member management and minting with owner account.
9. Add event listeners / optional TheGraph to index proposals and votes for improved UX.
10. Add full error handling, confirmations, and transaction state feedback.

Security & UX notes
- Always confirm parameter values before sending a transaction (especially for propose with calldatas).
- Show the exact calldata and recipient addresses in the proposal preview to reduce malicious submissions.
- Encourage usage of timelock long enough (>= 1 day enforced by factory) to allow off-chain review.
- For production, consider backend indexing or TheGraph for listing proposals and vote histories.

Deliverables I can produce next (choose one)
- Full screen/component breakdown in Figma-like detail (props, states per component).
- Example Next.js pages + React components wiring (skeleton) matching the proposed routes and contract calls.
- A small integration example: DAO list + DAO dashboard + Proposal creation flow using wagmi/ethers.
- TheGraph subgraph manifest for indexing DAOs and proposals.

What's next (concrete)
- Tell me which deliverable you'd like next. If you want code, I can scaffold the routes and components in src and wire basic on-chain calls (using ethers or wagmi). If you prefer a design-first approach, I can produce a component spec and JSON describing props and API calls.

If you want, I can immediately scaffold:
- /daos page (list)
- /dao/[governorAddress] dashboard
- Create DAO wizard skeleton
and wire them to call `GovernorFactory.getAllDaos()` and `createDAO` using ethers.js and a small provider wrapper.

Would you like me to scaffold pages/components now or produce a concise Figma-like component spec first?