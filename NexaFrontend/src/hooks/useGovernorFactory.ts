import { useState, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useTransaction, useWatchContractEvent } from 'wagmi';
import { Address } from 'viem';
import { governorFactoryAbi } from '@/lib/abi/faoctories/governorFactory';

type TokenType = 0 | 1; // 0 for ERC20, 1 for ERC721

export interface DAOConfig {
  daoName: string;
  metadataURI: string;
  daoDescription: string;
  governor: Address;
  timelock: Address;
  treasury: Address;
  token: Address;
  tokenType: TokenType;
  creator: Address;
  createdAt: bigint;
}

export interface CreateDAOParams {
  daoName: string;
  daoDescription: string;
  metadataURI: string;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: bigint;
  maxSupply: bigint;
  votingDelay: number;
  votingPeriod: number;
  proposalThreshold: bigint;
  timelockDelay: number;
  quorumPercentage: number;
  tokenType: TokenType;
  baseURI?: string;
}

export function useGovernorFactory(contractAddress?: Address) {
  const { address: account } = useAccount();
  const [isCreatingDAO, setIsCreatingDAO] = useState(false);
  const [daoCreationError, setDaoCreationError] = useState<string | null>(null);
  const [createdDAO, setCreatedDAO] = useState<{
    governor: Address;
    timelock: Address;
    treasury: Address;
    token: Address;
  } | null>(null);

  // Read operations
  const {
    data: daoCount,
    isLoading: isLoadingDaoCount,
    refetch: refetchDaoCount,
  } = useReadContract({
    address: contractAddress,
    abi: governorFactoryAbi,
    functionName: 'getDaoCount',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: allDAOs = [],
    isLoading: isLoadingAllDAOs,
    refetch: refetchAllDAOs,
  } = useReadContract({
    address: contractAddress,
    abi: governorFactoryAbi,
    functionName: 'getAllDaos',
    query: {
      enabled: !!contractAddress,
    },
  }) as { data: DAOConfig[]; isLoading: boolean; refetch: () => void };

  const {
    data: userDAOs = [],
    isLoading: isLoadingUserDAOs,
    refetch: refetchUserDAOs,
  } = useReadContract({
    address: contractAddress,
    abi: governorFactoryAbi,
    functionName: 'getDaosByCreator',
    args: [account as Address],
    query: {
      enabled: !!contractAddress && !!account,
    },
  }) as { data: Address[]; isLoading: boolean; refetch: () => void };

  // Write operations
  const { 
    writeAsync: createDAO, 
    data: createDAOTxData,
    isLoading: isCreateDAOLoading,
    error: createDAOError
  } = useWriteContract({
    address: contractAddress,
    abi: governorFactoryAbi,
    functionName: 'createDAO',
  });

  const { 
    writeAsync: deleteDAO, 
    isLoading: isDeleteDAOLoading,
    error: deleteDAOError
  } = useWriteContract({
    address: contractAddress,
    abi: governorFactoryAbi,
    functionName: 'deleteDao',
  });

  // Wait for transaction to be mined
  const { isLoading: isCreateDAOPending } = useTransaction({
    hash: createDAOTxData?.hash,
    onSuccess: () => {
      // Refetch DAO data after successful creation
      Promise.all([refetchDaoCount(), refetchAllDAOs(), refetchUserDAOs()]);
    },
  });

  // Listen for DAOCreated events
  useWatchContractEvent({
    address: contractAddress,
    abi: governorFactoryAbi,
    eventName: 'DAOCreated',
    listener(logs) {
      if (logs.length > 0) {
        const latestLog = logs[0];
        if ('args' in latestLog && latestLog.args) {
          const { governor, timelock, treasury, token } = latestLog.args;
          setCreatedDAO({
            governor: governor as Address,
            timelock: timelock as Address,
            treasury: treasury as Address,
            token: token as Address,
          });
        }
      }
    },
  });

  // Create a new DAO
  const createNewDAO = useCallback(async (params: CreateDAOParams) => {
    if (!createDAO) {
      throw new Error('Contract not initialized');
    }

    setIsCreatingDAO(true);
    setDaoCreationError(null);
    setCreatedDAO(null);

    try {
      const { daoName, daoDescription, metadataURI, tokenName, tokenSymbol, initialSupply, maxSupply, votingDelay, votingPeriod, proposalThreshold, timelockDelay, quorumPercentage, tokenType, baseURI = '' } = params;
      
      const tx = await createDAO({
        args: [
          daoName,
          daoDescription,
          metadataURI,
          tokenName,
          tokenSymbol,
          initialSupply,
          maxSupply,
          BigInt(votingDelay),
          BigInt(votingPeriod),
          proposalThreshold,
          BigInt(timelockDelay),
          BigInt(quorumPercentage),
          tokenType,
          baseURI
        ],
      });

      return tx;
    } catch (error) {
      console.error('Error creating DAO:', error);
      setDaoCreationError(error instanceof Error ? error.message : 'Failed to create DAO');
      throw error;
    } finally {
      setIsCreatingDAO(false);
    }
  }, [createDAO]);

  // Delete a DAO
  const removeDAO = useCallback(async (daoId: bigint) => {
    if (!deleteDAO) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await deleteDAO({
        args: [daoId],
      });

      // Wait for the transaction to be mined
      await tx.wait();
      
      // Refetch DAO data after deletion
      await Promise.all([refetchDaoCount(), refetchAllDAOs(), refetchUserDAOs()]);
      
      return tx;
    } catch (error) {
      console.error('Error deleting DAO:', error);
      throw error;
    }
  }, [deleteDAO, refetchDaoCount, refetchAllDAOs, refetchUserDAOs]);

  // Get a single DAO by ID
  const getDAOById = useCallback(async (daoId: number): Promise<DAOConfig | null> => {
    if (!contractAddress || typeof daoId !== 'number') return null;
    
    // This is a placeholder - in a real implementation, you might use a view function
    // or fetch from subgraph/indexer
    return allDAOs[daoId] || null;
  }, [allDAOs, contractAddress]);

  // Get DAOs by token type
  const getDAOsByTokenType = useCallback(async (tokenType: TokenType): Promise<DAOConfig[]> => {
    if (!contractAddress) return [];
    
    // This is a placeholder - in a real implementation, you would call the contract
    // or fetch from a subgraph/indexer
    return allDAOs.filter(dao => dao.tokenType === tokenType);
  }, [allDAOs, contractAddress]);

  // Get DAO by governor address
  const getDAOByAddress = useCallback((address: Address): DAOConfig | undefined => {
    return allDAOs.find(dao => 
      dao.governor === address || 
      dao.timelock === address || 
      dao.treasury === address || 
      dao.token === address
    );
  }, [allDAOs]);

  // Refresh all DAO data
  const refreshDAOs = useCallback(async () => {
    await Promise.all([refetchDaoCount(), refetchAllDAOs(), refetchUserDAOs()]);
  }, [refetchDaoCount, refetchAllDAOs, refetchUserDAOs]);

  return {
    // State
    isCreatingDAO: isCreatingDAO || isCreateDAOLoading || isCreateDAOPending,
    daoCreationError,
    createdDAO,
    allDAOs,
    userDAOs,
    daoCount: daoCount || BigInt(0),
    isLoading: isLoadingDaoCount || isLoadingAllDAOs || isLoadingUserDAOs,
    
    // Actions
    createDAO: createNewDAO,
    deleteDAO: removeDAO,
    getDAOById,
    getDAOByAddress,
    getDAOsByTokenType,
    refreshDAOs,
    
    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: governorFactoryAbi,
    },
  };
}

export default useGovernorFactory;



// const { 
//     createDAO, 
//     allDAOs, 
//     userDAOs, 
//     isLoading, 
//     isCreatingDAO,
//     daoCreationError 
//   } = useGovernorFactory(contractAddress);
  
//   // Create a new DAO
//   const handleCreateDAO = async () => {
//     try {
//       const tx = await createDAO({
//         daoName: "My DAO",
//         daoDescription: "A new DAO for testing",
//         metadataURI: "ipfs://...",
//         tokenName: "Vote Token",
//         tokenSymbol: "VOTE",
//         initialSupply: BigInt(1000000),
//         maxSupply: BigInt(1000000),
//         votingDelay: 1,
//         votingPeriod: 100,
//         proposalThreshold: BigInt(1000),
//         timelockDelay: 86400, // 1 day
//         quorumPercentage: 4, // 4%
//         tokenType: 0, // 0 for ERC20
//       });
//       // Transaction submitted, wait for confirmation
//     } catch (error) {
//       console.error("Failed to create DAO:", error);
//     }
//   };