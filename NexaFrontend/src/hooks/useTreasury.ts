import { useState, useCallback, useEffect } from 'react';
import { useReadContract, useWriteContract, useTransaction, useWatchContractEvent } from 'wagmi';
import { Address } from 'viem';
import { treasuryAbi } from '@/lib/abi/core/treasury';

export interface TreasuryConfig {
  governor: Address;
  timelock: Address;
}

export function useTreasury(contractAddress?: Address) {
  // const { address: account } = useAccount();
  const [ethBalance, setEthBalance] = useState<bigint>(0n);
  const [tokenBalances, setTokenBalances] = useState<Record<Address, bigint>>({});

  // Read operations
  const {
    data: governor,
    isLoading: isLoadingGovernor,
    refetch: refetchGovernor,
  } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'governor',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: timelock,
    isLoading: isLoadingTimelock,
    refetch: refetchTimelock,
  } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'timelock',
    query: {
      enabled: !!contractAddress,
    },
  });

  // Get ETH balance
  const {
    data: ethBalanceData,
    refetch: refetchEthBalance,
    isLoading: isLoadingEthBalance,
  } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'getETHBalance',
    query: {
      enabled: !!contractAddress,
    },
    // watch: true, // Auto-refresh when new blocks are mined
  });

  // Get token balance for a specific token
  const getTokenBalance = useCallback(async (tokenAddress: Address): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchTokenBalance({ args: [tokenAddress] });
      return data ?? 0n;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchTokenBalance,
  } = useReadContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'getTokenBalance',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Write operations
  const { 
    writeContractAsync: withdrawETH, 
    data: withdrawETHTxData,
    isPending: isWithdrawETHLoading,
    error: withdrawETHError
  } = useWriteContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'withdrawETH',
  });

  const { 
    writeContractAsync: withdrawToken, 
    data: withdrawTokenTxData,
    isPending: isWithdrawTokenLoading,
    error: withdrawTokenError
  } = useWriteContract({
    address: contractAddress,
    abi: treasuryAbi,
    functionName: 'withdrawToken',
  });

  // Wait for transactions to be mined
  const { isLoading: isWithdrawETHPending } = useTransaction({
    hash: withdrawETHTxData?.hash,
    onSuccess: () => {
      refetchEthBalance();
    },
  });

  const { isLoading: isWithdrawTokenPending } = useTransaction({
    hash: withdrawTokenTxData?.hash,
    onSuccess: (receipt) => {
      // Extract token address from transaction logs to refresh its balance
      const tokenAddress = receipt.logs[0]?.address;
      if (tokenAddress) {
        refetchTokenBalance({ args: [tokenAddress] });
      }
    },
  });

  // Event listeners
  useWatchContractEvent({
    address: contractAddress,
    abi: treasuryAbi,
    eventName: 'ETHReceived',
    listener(logs) {
      if (logs.length > 0) {
        refetchEthBalance();
      }
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: treasuryAbi,
    eventName: 'ETHWithdrawn',
    listener() {
      refetchEthBalance();
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: treasuryAbi,
    eventName: 'TokenWithdrawn',
    listener(logs) {
      if (logs.length > 0 && 'args' in logs[0] && logs[0].args?.token) {
        refetchTokenBalance({ args: [logs[0].args.token] });
      }
    },
  });

  // Update ETH balance when data changes
  useEffect(() => {
    if (ethBalanceData !== undefined) {
      setEthBalance(ethBalanceData as bigint);
    }
  }, [ethBalanceData]);

  // Withdraw ETH from treasury
  const withdrawFunds = useCallback(async (recipient: Address, amount: bigint) => {
    if (!withdrawETH) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await withdrawETH({
        args: [recipient, amount],
      });
      return tx;
    } catch (error) {
      console.error('Error withdrawing ETH:', error);
      throw error;
    }
  }, [withdrawETH]);

  // Withdraw ERC20 tokens from treasury
  const withdrawTokens = useCallback(async (token: Address, recipient: Address, amount: bigint) => {
    if (!withdrawToken) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await withdrawToken({
        args: [token, recipient, amount],
      });
      return tx;
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      throw error;
    }
  }, [withdrawToken]);

  // Get token balance and cache it
  const fetchAndCacheTokenBalance = useCallback(async (tokenAddress: Address): Promise<bigint> => {
    const balance = await getTokenBalance(tokenAddress);
    setTokenBalances(prev => ({
      ...prev,
      [tokenAddress]: balance
    }));
    return balance;
  }, [getTokenBalance]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchGovernor(),
      refetchTimelock(),
      refetchEthBalance(),
    ]);
  }, [refetchGovernor, refetchTimelock, refetchEthBalance]);

  return {
    // State
    config: {
      governor: governor as Address | undefined,
      timelock: timelock as Address | undefined,
    },
    ethBalance,
    tokenBalances,
    isLoading: isLoadingGovernor || isLoadingTimelock || isLoadingEthBalance,
    isWithdrawing: isWithdrawETHLoading || isWithdrawTokenLoading || isWithdrawETHPending || isWithdrawTokenPending,
    error: withdrawETHError || withdrawTokenError,

    // Actions
    getTokenBalance: fetchAndCacheTokenBalance,
    withdrawETH: withdrawFunds,
    withdrawToken: withdrawTokens,
    refresh,

    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: treasuryAbi,
    },
  };
}

export default useTreasury;



// const { 
//     ethBalance,
//     tokenBalances,
//     getTokenBalance,
//     withdrawETH,
//     withdrawToken,
//     isLoading,
//     isWithdrawing,
//     error
//   } = useTreasury(treasuryAddress);
  
//   // Get token balance
//   useEffect(() => {
//     if (tokenAddress) {
//       getTokenBalance(tokenAddress);
//     }
//   }, [tokenAddress, getTokenBalance]);
  
//   // Withdraw ETH
//   const handleWithdrawETH = async () => {
//     try {
//       const tx = await withdrawETH(recipientAddress, amount);
//       await tx.wait();
//       // Transaction confirmed
//     } catch (err) {
//       console.error('Withdrawal failed:', err);
//     }
//   };
  
//   // Withdraw tokens
//   const handleWithdrawTokens = async () => {
//     try {
//       const tx = await withdrawToken(tokenAddress, recipientAddress, amount);
//       await tx.wait();
//       // Transaction confirmed
//     } catch (err) {
//       console.error('Token withdrawal failed:', err);
//     }
//   };