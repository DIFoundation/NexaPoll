import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction, useContractEvent } from 'wagmi';
import { Address, Hash } from 'viem';
import { timelockAbi } from '@/lib/abi/core/timelock';

export type OperationState = 'Unknown' | 'Pending' | 'Ready' | 'Done' | 'Cancelled';

export interface OperationDetails {
  id: Hash;
  target: Address;
  value: bigint;
  data: string;
  predecessor: Hash;
  salt: Hash;
  delay: bigint;
  timestamp: bigint;
  state: OperationState;
}

export interface BatchOperationDetails {
  id: Hash;
  targets: Address[];
  values: bigint[];
  payloads: string[];
  predecessor: Hash;
  salt: Hash;
  delay: bigint;
  timestamp: bigint;
  state: OperationState;
}

export function useTimelock(contractAddress?: Address) {
  const { address: account } = useAccount();
  const [minDelay, setMinDelay] = useState<bigint>(0n);
  const [operations, setOperations] = useState<Record<string, OperationDetails>>({});
  const [batchOperations, setBatchOperations] = useState<Record<string, BatchOperationDetails>>({});

  // Role hashes
  const {
    data: adminRole,
    isLoading: isLoadingRoles,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
    enabled: !!contractAddress,
  });

  const {
    data: proposerRole,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'PROPOSER_ROLE',
    enabled: !!contractAddress,
  });

  const {
    data: executorRole,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'EXECUTOR_ROLE',
    enabled: !!contractAddress,
  });

  const {
    data: cancellerRole,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'CANCELLER_ROLE',
    enabled: !!contractAddress,
  });

  // Get minimum delay
  const {
    data: delayData,
    refetch: refetchMinDelay,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'getMinDelay',
    enabled: !!contractAddress,
    watch: true,
  });

  // Check roles for current account
  const hasRole = useCallback(async (role: Hash): Promise<boolean> => {
    if (!contractAddress || !account) return false;
    
    const { data } = await refetchHasRole({ 
      args: [role, account] 
    });
    return data ?? false;
  }, [contractAddress, account]);

  const {
    refetch: refetchHasRole,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'hasRole',
    enabled: false, // We'll call this manually
  });

  // Schedule a new operation
  const { 
    writeAsync: scheduleOperation, 
    data: scheduleTxData,
    isLoading: isScheduling,
    error: scheduleError
  } = useContractWrite({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'schedule',
  });

  // Schedule a batch operation
  const { 
    writeAsync: scheduleBatchOperation, 
    data: scheduleBatchTxData,
    isLoading: isBatchScheduling,
    error: scheduleBatchError
  } = useContractWrite({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'scheduleBatch',
  });

  // Execute an operation
  const { 
    writeAsync: executeOperation, 
    data: executeTxData,
    isLoading: isExecuting,
    error: executeError
  } = useContractWrite({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'execute',
  });

  // Cancel an operation
  const { 
    writeAsync: cancelOperation, 
    data: cancelTxData,
    isLoading: isCancelling,
    error: cancelError
  } = useContractWrite({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'cancel',
  });

  // Wait for transactions to be mined
  useWaitForTransaction({
    hash: scheduleTxData?.hash,
    onSuccess: () => {
      // Refresh operations after scheduling
      // In a real app, you might want to update the specific operation
      // based on the operation ID from the transaction logs
    },
  });

  useWaitForTransaction({
    hash: executeTxData?.hash,
    onSuccess: () => {
      // Refresh operations after execution
    },
  });

  // Event listeners
  useContractEvent({
    address: contractAddress,
    abi: timelockAbi,
    eventName: 'CallScheduled',
    listener(logs) {
      if (logs.length > 0 && 'args' in logs[0] && logs[0].args) {
        const { id, target, value, data, predecessor, delay } = logs[0].args;
        const operation: OperationDetails = {
          id: id as Hash,
          target: target as Address,
          value: (value as bigint) || 0n,
          data: data as string,
          predecessor: predecessor as Hash,
          salt: '0x', // Not available in the event
          delay: (delay as bigint) || 0n,
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
          state: 'Pending',
        };
        setOperations(prev => ({ ...prev, [operation.id]: operation }));
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: timelockAbi,
    eventName: 'CallExecuted',
    listener(logs) {
      if (logs.length > 0 && 'args' in logs[0] && logs[0].args) {
        const { id } = logs[0].args;
        setOperations(prev => {
          const updated = { ...prev };
          if (updated[id as string]) {
            updated[id as string].state = 'Done';
          }
          return updated;
        });
      }
    },
  });

  // Update min delay when data changes
  useEffect(() => {
    if (delayData !== undefined) {
      setMinDelay(delayData as bigint);
    }
  }, [delayData]);

  // Check operation state
  const getOperationState = useCallback(async (id: Hash): Promise<OperationState> => {
    if (!contractAddress) return 'Unknown';
    
    try {
      const { data } = await refetchOperationState({ args: [id] });
      switch (data) {
        case 0: return 'Unknown';
        case 1: return 'Pending';
        case 2: return 'Ready';
        case 3: return 'Done';
        case 4: return 'Cancelled';
        default: return 'Unknown';
      }
    } catch (error) {
      console.error('Error getting operation state:', error);
      return 'Unknown';
    }
  }, [contractAddress]);

  const {
    refetch: refetchOperationState,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'getOperationState',
    enabled: false, // We'll call this manually
  });

  // Schedule a new operation
  const schedule = useCallback(async (
    target: Address,
    value: bigint,
    data: string,
    predecessor: Hash = '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: Hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  ) => {
    if (!scheduleOperation) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await scheduleOperation({
        args: [target, value, data, predecessor, salt, minDelay],
      });
      return tx;
    } catch (error) {
      console.error('Error scheduling operation:', error);
      throw error;
    }
  }, [scheduleOperation, minDelay]);

  // Execute an operation
  const execute = useCallback(async (
    target: Address,
    value: bigint,
    data: string,
    predecessor: Hash = '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: Hash = '0x0000000000000000000000000000000000000000000000000000000000000000'
  ) => {
    if (!executeOperation) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await executeOperation({
        args: [target, value, data, predecessor, salt],
        value, // Include value for payable functions
      });
      return tx;
    } catch (error) {
      console.error('Error executing operation:', error);
      throw error;
    }
  }, [executeOperation]);

  // Cancel an operation
  const cancel = useCallback(async (id: Hash) => {
    if (!cancelOperation) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await cancelOperation({
        args: [id],
      });
      return tx;
    } catch (error) {
      console.error('Error cancelling operation:', error);
      throw error;
    }
  }, [cancelOperation]);

  // Check if operation is ready
  const isOperationReady = useCallback(async (id: Hash): Promise<boolean> => {
    if (!contractAddress) return false;
    
    try {
      const { data } = await refetchIsOperationReady({ args: [id] });
      return data ?? false;
    } catch (error) {
      console.error('Error checking if operation is ready:', error);
      return false;
    }
  }, [contractAddress]);

  const {
    refetch: refetchIsOperationReady,
  } = useContractRead({
    address: contractAddress,
    abi: timelockAbi,
    functionName: 'isOperationReady',
    enabled: false, // We'll call this manually
  });

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchMinDelay(),
      // Add other refetch calls as needed
    ]);
  }, [refetchMinDelay]);

  return {
    // State
    minDelay,
    operations,
    batchOperations,
    isLoading: isLoadingRoles,
    isScheduling,
    isBatchScheduling,
    isExecuting,
    isCancelling,
    error: scheduleError || scheduleBatchError || executeError || cancelError,
    
    // Roles
    roles: {
      admin: adminRole as Hash | undefined,
      proposer: proposerRole as Hash | undefined,
      executor: executorRole as Hash | undefined,
      canceller: cancellerRole as Hash | undefined,
    },

    // Actions
    hasRole,
    schedule,
    execute,
    cancel,
    isOperationReady,
    getOperationState,
    refresh,

    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: timelockAbi,
    },
  };
}

export default useTimelock;


// const { 
//     minDelay,
//     operations,
//     schedule,
//     execute,
//     cancel,
//     isOperationReady,
//     hasRole,
//     isLoading,
//     isScheduling,
//     isExecuting
//   } = useTimelock(timelockAddress);
  
//   // Check if current user is a proposer
//   useEffect(() => {
//     const checkRole = async () => {
//       const isProposer = await hasRole(proposerRole);
//       // Update UI based on role
//     };
//     checkRole();
//   }, [hasRole, proposerRole]);
  
//   // Schedule a new operation
//   const handleSchedule = async () => {
//     try {
//       const tx = await schedule(
//         targetAddress,
//         value,
//         encodedFunctionData,
//         predecessor,
//         salt
//       );
//       await tx.wait();
//       // Operation scheduled
//     } catch (error) {
//       console.error('Failed to schedule operation:', error);
//     }
//   };
  
//   // Execute an operation
//   const handleExecute = async (operationId: Hash) => {
//     try {
//       const isReady = await isOperationReady(operationId);
//       if (!isReady) {
//         throw new Error('Operation is not ready to execute');
//       }
      
//       const tx = await execute(
//         operations[operationId].target,
//         operations[operationId].value,
//         operations[operationId].data,
//         operations[operationId].predecessor,
//         operations[operationId].salt
//       );
//       await tx.wait();
//       // Operation executed
//     } catch (error) {
//       console.error('Failed to execute operation:', error);
//     }
//   };