import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { Address, Hash } from 'viem';
import { governorAbi } from '@/lib/abi/core/governor';

export type VoteType = 0 | 1 | 2; // 0=Against, 1=For, 2=Abstain
export type ProposalState = 'Pending' | 'Active' | 'Canceled' | 'Defeated' | 'Succeeded' | 'Queued' | 'Expired' | 'Executed';

export interface ProposalMetadata {
  title: string;
  description: string;
  proposalType: string;
  proposedSolution: string;
  rationale: string;
  expectedOutcomes: string;
  timeline: string;
  budget: string;
  proposer: Address;
  timestamp: bigint;
  status: number;
  votesFor: bigint;
  votesAgainst: bigint;
  quorumReachedPct: bigint;
}

export interface Proposal {
  id: string;
  proposer: Address;
  targets: Address[];
  values: bigint[];
  signatures: string[];
  calldatas: string[];
  voteStart: bigint;
  voteEnd: bigint;
  description: string;
  state: ProposalState;
  metadata: ProposalMetadata;
}

export function useGovernor(contractAddress?: Address) {
  const { address: account } = useAccount();
  const [proposals, setProposals] = useState<Record<string, Proposal>>({});
  const [votingToken, setVotingToken] = useState<Address | undefined>();
  const [timelock, setTimelock] = useState<Address | undefined>();
  const [votingDelay, setVotingDelay] = useState<bigint>(0n);
  const [votingPeriod, setVotingPeriod] = useState<bigint>(0n);
  const [proposalThreshold, setProposalThreshold] = useState<bigint>(0n);
  const [quorumPercentage, setQuorumPercentage] = useState<bigint>(0n);

  // Contract state
  const {
    data: tokenAddress,
    refetch: refetchToken,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'token',
    enabled: !!contractAddress,
  });

  const {
    data: timelockAddress,
    refetch: refetchTimelock,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'timelock',
    enabled: !!contractAddress,
  });

  const {
    data: votingDelayData,
    refetch: refetchVotingDelay,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'votingDelay',
    enabled: !!contractAddress,
  });

  const {
    data: votingPeriodData,
    refetch: refetchVotingPeriod,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'votingPeriod',
    enabled: !!contractAddress,
  });

  const {
    data: proposalThresholdData,
    refetch: refetchProposalThreshold,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'proposalThreshold',
    enabled: !!contractAddress,
  });

  const {
    data: quorumPercentageData,
    refetch: refetchQuorumPercentage,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'quorumPercentage',
    enabled: !!contractAddress,
  });

  // Proposal actions
  const { 
    writeAsync: propose, 
    data: proposeTxData,
    isLoading: isProposing,
    error: proposeError
  } = useContractWrite({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'propose',
  });

  const { 
    writeAsync: castVote, 
    data: voteTxData,
    isLoading: isVoting,
    error: voteError
  } = useContractWrite({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'castVote',
  });

  const { 
    writeAsync: executeProposal, 
    data: executeTxData,
    isLoading: isExecuting,
    error: executeError
  } = useContractWrite({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'execute',
  });

  const { 
    writeAsync: cancelProposal, 
    data: cancelTxData,
    isLoading: isCanceling,
    error: cancelError
  } = useContractWrite({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'cancel',
  });

  // Wait for transactions
  useWaitForTransaction({
    hash: proposeTxData?.hash,
    onSuccess: () => {
      // Refresh proposals after a new one is created
      // In a real app, you might want to update the specific proposal
      // based on the proposal ID from the transaction logs
    },
  });

  useWaitForTransaction({
    hash: voteTxData?.hash,
    onSuccess: () => {
      // Refresh proposal state after voting
    },
  });

  // Update state when data changes
  useEffect(() => {
    if (tokenAddress) setVotingToken(tokenAddress as Address);
    if (timelockAddress) setTimelock(timelockAddress as Address);
    if (votingDelayData !== undefined) setVotingDelay(BigInt(votingDelayData.toString()));
    if (votingPeriodData !== undefined) setVotingPeriod(BigInt(votingPeriodData.toString()));
    if (proposalThresholdData !== undefined) setProposalThreshold(BigInt(proposalThresholdData.toString()));
    if (quorumPercentageData !== undefined) setQuorumPercentage(BigInt(quorumPercentageData.toString()));
  }, [tokenAddress, timelockAddress, votingDelayData, votingPeriodData, proposalThresholdData, quorumPercentageData]);

  // Get proposal metadata
  const getProposalMetadata = useCallback(async (proposalId: string): Promise<ProposalMetadata | null> => {
    if (!contractAddress) return null;
    
    try {
      const { data } = await refetchProposalMetadata({ args: [BigInt(proposalId)] });
      if (!data) return null;
      
      // Map the raw data to our metadata interface
      const [
        title,
        description,
        proposalType,
        proposedSolution,
        rationale,
        expectedOutcomes,
        timeline,
        budget,
        proposer,
        timestamp,
        status,
        votesFor,
        votesAgainst,
        quorumReachedPct
      ] = data as any[];

      return {
        title,
        description,
        proposalType,
        proposedSolution,
        rationale,
        expectedOutcomes,
        timeline,
        budget,
        proposer,
        timestamp,
        status,
        votesFor,
        votesAgainst,
        quorumReachedPct
      };
    } catch (error) {
      console.error('Error fetching proposal metadata:', error);
      return null;
    }
  }, [contractAddress]);

  const {
    refetch: refetchProposalMetadata,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'getProposalMetadata',
    enabled: false, // We'll call this manually
  });

  // Create a new proposal
  const createProposal = useCallback(async (
    targets: Address[],
    values: bigint[],
    calldatas: string[],
    description: string,
    metadata: Omit<ProposalMetadata, 'proposer' | 'timestamp' | 'status' | 'votesFor' | 'votesAgainst' | 'quorumReachedPct'>
  ) => {
    if (!propose) {
      throw new Error('Contract not initialized');
    }

    try {
      // First, create the proposal
      const tx = await propose({
        args: [targets, values, calldatas, description],
      });

      // In a real app, you would want to:
      // 1. Wait for the transaction to be mined
      // 2. Parse the transaction receipt to get the proposal ID
      // 3. Store the metadata with the proposal ID
      
      return tx;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }, [propose]);

  // Vote on a proposal
  const vote = useCallback(async (proposalId: string, support: VoteType, reason: string = '') => {
    if (!castVote) {
      throw new Error('Contract not initialized');
    }

    try {
      // Cast vote with reason if provided
      const tx = await castVote({
        args: [BigInt(proposalId), support],
        ...(reason && { args: [BigInt(proposalId), support, reason] }),
      });
      return tx;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }, [castVote]);

  // Execute a proposal
  const execute = useCallback(async (
    targets: Address[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    if (!executeProposal) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await executeProposal({
        args: [targets, values, calldatas, '0x'],
      });
      return tx;
    } catch (error) {
      console.error('Error executing proposal:', error);
      throw error;
    }
  }, [executeProposal]);

  // Cancel a proposal
  const cancel = useCallback(async (
    targets: Address[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    if (!cancelProposal) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await cancelProposal({
        args: [targets, values, calldatas, '0x'],
      });
      return tx;
    } catch (error) {
      console.error('Error canceling proposal:', error);
      throw error;
    }
  }, [cancelProposal]);

  // Check if an account has voted on a proposal
  const hasVoted = useCallback(async (proposalId: string, account: Address): Promise<boolean> => {
    if (!contractAddress) return false;
    
    try {
      const { data } = await refetchHasVoted({ 
        args: [BigInt(proposalId), account] 
      });
      return data as boolean;
    } catch (error) {
      console.error('Error checking if account has voted:', error);
      return false;
    }
  }, [contractAddress]);

  const {
    refetch: refetchHasVoted,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'hasVoted',
    enabled: false, // We'll call this manually
  });

  // Get vote power for an account at a specific block
  const getVotes = useCallback(async (account: Address, blockNumber: bigint): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchVotes({ 
        args: [account, blockNumber] 
      });
      return BigInt(data?.toString() || '0');
    } catch (error) {
      console.error('Error getting votes:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchVotes,
  } = useContractRead({
    address: contractAddress,
    abi: governorAbi,
    functionName: 'getVotes',
    enabled: false, // We'll call this manually
  });

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchToken(),
      refetchTimelock(),
      refetchVotingDelay(),
      refetchVotingPeriod(),
      refetchProposalThreshold(),
      refetchQuorumPercentage(),
    ]);
  }, [
    refetchToken,
    refetchTimelock,
    refetchVotingDelay,
    refetchVotingPeriod,
    refetchProposalThreshold,
    refetchQuorumPercentage,
  ]);

  return {
    // State
    votingToken,
    timelock,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumPercentage,
    proposals,
    isLoading: !votingToken || !timelock,
    isProposing,
    isVoting,
    isExecuting,
    isCanceling,
    error: proposeError || voteError || executeError || cancelError,

    // Actions
    createProposal,
    vote,
    execute,
    cancel,
    hasVoted,
    getVotes,
    getProposalMetadata,
    refresh,

    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: governorAbi,
    },
  };
}

export default useGovernor;


// const { 
//     createProposal,
//     vote,
//     execute,
//     proposals,
//     votingToken,
//     votingPeriod,
//     isLoading,
//     isProposing
//   } = useGovernor(governorAddress);
  
//   // Create a new proposal
//   const handleCreateProposal = async () => {
//     try {
//       const tx = await createProposal(
//         [targetContractAddress], // targets
//         [0n], // values (ETH to send)
//         [encodedFunctionData], // calldatas
//         "Proposal to update protocol parameters",
//         {
//           title: "Update Protocol Parameters",
//           description: "This proposal updates key protocol parameters",
//           proposalType: "Parameter Update",
//           proposedSolution: "Adjust the interest rate to 5%",
//           rationale: "Current rates are not sustainable",
//           expectedOutcomes: "Better capital efficiency",
//           timeline: "Immediate upon execution",
//           budget: "No additional budget required"
//         }
//       );
//       await tx.wait();
//       // Proposal created
//     } catch (error) {
//       console.error('Failed to create proposal:', error);
//     }
//   };
  
//   // Vote on a proposal
//   const handleVote = async (proposalId: string, support: VoteType) => {
//     try {
//       const tx = await vote(
//         proposalId,
//         support,
//         "I support this proposal because..."
//       );
//       await tx.wait();
//       // Vote cast
//     } catch (error) {
//       console.error('Failed to cast vote:', error);
//     }
//   };
  
//   // Execute a proposal
//   const handleExecute = async (proposal: Proposal) => {
//     try {
//       const tx = await execute(
//         proposal.targets,
//         proposal.values,
//         proposal.calldatas,
//         proposal.description
//       );
//       await tx.wait();
//       // Proposal executed
//     } catch (error) {
//       console.error('Failed to execute proposal:', error);
//     }
//   };