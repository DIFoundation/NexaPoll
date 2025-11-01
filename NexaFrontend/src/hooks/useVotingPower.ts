import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Address, Hash } from 'viem';
import { erc20VotingPower } from '@/lib/abi/core/votingPower/erc20';
import { erc721VotingPower } from '@/lib/abi/core/votingPower/erc721';

export interface Checkpoint {
  fromBlock: bigint;
  votes: bigint;
}

export interface Delegation {
  delegatee: Address;
  nonce: bigint;
  expiry: bigint;
}

export interface NFT {
  tokenId: bigint;
  owner: Address;
  tokenURI: string;
  approved: Address | null;
}

export function useERC20VotingPower(contractAddress?: Address) {
  const { address: account } = useAccount();
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [decimals, setDecimals] = useState<number>(18);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [maxSupply, setMaxSupply] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [delegates, setDelegates] = useState<Record<Address, Address>>({});
  const [votingPower, setVotingPower] = useState<bigint>(0n);

  // Token metadata
  const {
    data: tokenName,
    refetch: refetchName,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'name',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenSymbol,
    refetch: refetchSymbol,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'symbol',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenDecimals,
    refetch: refetchDecimals,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'decimals',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenTotalSupply,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'totalSupply',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenMaxSupply,
    refetch: refetchMaxSupply,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'maxSupply',
    query: {
      enabled: !!contractAddress,
    },
  });

  // Account balance and voting power
  const {
    data: accountBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  const {
    data: currentVotes,
    refetch: refetchVotes,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'getVotes',
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  // Token actions
  const { 
    writeContractAsync: transfer, 
    isPending: isTransferring,
    error: transferError,
    // data: transferTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'transfer',
  });

  const { 
    writeContractAsync: approve, 
    isPending: isApproving,
    error: approveError,
    // data: approveTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'approve',
  });

  const { 
    writeContractAsync: delegate, 
    // data: delegateTxData,
    isPending: isDelegating,
    error: delegateError
  } = useWriteContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'delegate',
  });

  const { 
    writeContractAsync: delegateBySig, 
    // data: delegateBySigTxData,
    isPending: isDelegatingBySig,
    error: delegateBySigError
  } = useWriteContract({delegateVotes
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'delegateBySig',
  });

  // Update state when data changes
  useEffect(() => {
    if (tokenName) setName(tokenName as string);
    if (tokenSymbol) setSymbol(tokenSymbol as string);
    if (tokenDecimals !== undefined) setDecimals(Number(tokenDecimals));
    if (tokenTotalSupply !== undefined) setTotalSupply(BigInt(tokenTotalSupply.toString()));
    if (tokenMaxSupply !== undefined) setMaxSupply(BigInt(tokenMaxSupply.toString()));
    if (accountBalance !== undefined) setBalance(BigInt(accountBalance.toString()));
    if (currentVotes !== undefined) setVotingPower(BigInt(currentVotes.toString()));
  }, [tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply, tokenMaxSupply, accountBalance, currentVotes]);

  // Get voting power at a specific block
  const getVotesAtBlock = useCallback(async (account: Address, blockNumber: bigint): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchPastVotes({ 
        args: [account, blockNumber] 
      });
      return BigInt(data?.toString() || '0');
    } catch (error) {
      console.error('Error getting past votes:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchPastVotes,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'getPastVotes',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Get checkpoints for an account
  const getCheckpoints = useCallback(async (account: Address, start: number = 0, count: number = 10): Promise<Checkpoint[]> => {
    if (!contractAddress) return [];
    
    try {
      const checkpoints: Checkpoint[] = [];
      const { data: numCheckpoints } = await refetchNumCheckpoints({ args: [account] });
      const totalCheckpoints = Number(numCheckpoints || 0);
      
      if (totalCheckpoints === 0) return [];
      
      const end = Math.min(start + count, totalCheckpoints);
      
      for (let i = start; i < end; i++) {
        const { data: checkpoint } = await refetchCheckpoint({ 
          args: [account, i] 
        });
        
        if (checkpoint) {
          checkpoints.push({
            fromBlock: BigInt((checkpoint as any).fromBlock.toString()),
            votes: BigInt((checkpoint as any).votes.toString()),
          });
        }
      }
      
      return checkpoints;
    } catch (error) {
      console.error('Error getting checkpoints:', error);
      return [];
    }
  }, [contractAddress]);

  const {
    refetch: refetchNumCheckpoints,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'numCheckpoints',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  const {
    refetch: refetchCheckpoint,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'checkpoints',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Transfer tokens
  const transferTokens = useCallback(async (to: Address, amount: bigint) => {
    if (!transfer) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const txHash = await transfer({
        address: contractAddress!,
        abi: erc20VotingPower,
        functionName: 'transfer',
        args: [to, amount],
      });
      return txHash;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }, [contractAddress, transfer]);

  // Approve spender
  const approveSpender = useCallback(async (spender: Address, amount: bigint) => {
    if (!approve) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const txHash = await approve({
        address: contractAddress!,
        abi: erc20VotingPower,
        functionName: 'approve',
        args: [spender, amount],
      });
      return txHash;
    } catch (error) {
      console.error('Error approving spender:', error);
      throw error;
    }
  }, [contractAddress, approve]);

  // Delegate voting power
  const delegateVotes = useCallback(async (delegatee: Address) => {
    if (!delegate) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const txHash = await delegate({
        address: contractAddress!,
        abi: erc20VotingPower,
        functionName: 'delegate',
        args: [delegatee],
      });
      
      // Update local state
      if (account) {
        setDelegates(prev => ({
          ...prev,
          [account]: delegatee
        }));
      }
      
      return txHash;
    } catch (error) {
      console.error('Error delegating votes:', error);
      throw error;
    }
  }, [contractAddress, delegate, account]);

  // Delegate votes by signature
  const delegateVotesBySig = useCallback(async (
    delegatee: Address,
    nonce: bigint,
    expiry: bigint,
    v: number,
    r: Hash,
    s: Hash
  ) => {
    if (!delegateBySig) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const txHash = await delegateBySig({
        address: contractAddress!,
        abi: erc20VotingPower,
        functionName: 'delegateBySig',
        args: [delegatee, nonce, expiry, v, r, s],
      });
      return txHash;
    } catch (error) {
      console.error('Error delegating votes by signature:', error);
      throw error;
    }
  }, [contractAddress, delegateBySig]);

  // Get current delegate for an account
  const getDelegate = useCallback(async (account: Address): Promise<Address> => {
    if (!contractAddress) return '0x0000000000000000000000000000000000000000';
    
    try {
      const { data } = await refetchDelegates({ args: [account] });
      return data as Address;
    } catch (error) {
      console.error('Error getting delegate:', error);
      return '0x0000000000000000000000000000000000000000';
    }
  }, [contractAddress]);

  const {
    refetch: refetchDelegates,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'delegates',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Get allowance for a spender
  const getAllowance = useCallback(async (owner: Address, spender: Address): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchAllowance({ 
        args: [owner, spender] 
      });
      return BigInt(data?.toString() || '0');
    } catch (error) {
      console.error('Error getting allowance:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchAllowance,
  } = useReadContract({
    address: contractAddress,
    abi: erc20VotingPower,
    functionName: 'allowance',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchName(),
      refetchSymbol(),
      refetchDecimals(),
      refetchTotalSupply(),
      refetchMaxSupply(),
      account && refetchBalance(),
      account && refetchVotes(),
    ]);
  }, [
    refetchName,
    refetchSymbol,
    refetchDecimals,
    refetchTotalSupply,
    refetchMaxSupply,
    refetchBalance,
    refetchVotes,
    account,
  ]);

  return {
    // State
    name,
    symbol,
    decimals,
    totalSupply,
    maxSupply,
    balance,
    votingPower,
    delegates,
    isLoading: !name || !symbol,
    isTransferring,
    isApproving,
    isDelegating,
    isDelegatingBySig,
    error: transferError || approveError || delegateError || delegateBySigError,

    // Actions
    transfer: transferTokens,
    approve: approveSpender,
    delegate: delegateVotes,
    delegateBySig: delegateVotesBySig,
    getVotesAtBlock,
    getCheckpoints,
    getDelegate,
    getAllowance,
    refresh,

    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: erc20VotingPower,
    },
  };
}

// export default useERC20VotingPower;

export function useERC721VotingPower(contractAddress?: Address) {
  const { address: account } = useAccount();
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [maxSupply, setMaxSupply] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [votingPower, setVotingPower] = useState<bigint>(0n);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [delegate, setDelegate] = useState<Address | null>(null);

  // Token metadata
  const {
    data: tokenName,
    refetch: refetchName,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'name',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenSymbol,
    refetch: refetchSymbol,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'symbol',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenTotalSupply,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'totalSupply',
    query: {
      enabled: !!contractAddress,
    },
  });

  const {
    data: tokenMaxSupply,
    refetch: refetchMaxSupply,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'maxSupply',
    query: {
      enabled: !!contractAddress,
    },
  });

  // Account balance and voting power
  const {
    data: accountBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  const {
    data: currentVotes,
    refetch: refetchVotes,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'getVotes',
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  // Get current delegate
  const {
    data: currentDelegate,
    refetch: refetchDelegate,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'delegates',
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  // Token actions
  const { 
    writeContractAsync: transfer, 
    isPending: isTransferring,
    error: transferError,
    // data: transferTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'safeTransferFrom',
  });

  const { 
    writeContractAsync: approve, 
    isPending: isApproving,
    error: approveError,
    // data: approveTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'approve',
  });

  const { 
    writeContractAsync: setApprovalForAll, 
    isPending: isSettingApprovalForAll,
    error: approvalForAllError,
    // data: approvalForAllTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'setApprovalForAll',
  });

  const { 
    writeContractAsync: delegateVotes, 
    isPending: isDelegating,
    error: delegateError,
    // data: delegateTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'delegate',
  });

  const { 
    writeContractAsync: mint, 
    isPending: isMinting,
    error: mintError,
    // data: mintTxData
  } = useWriteContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'mint',
  });

  // Update state when data changes
  useEffect(() => {
    if (tokenName) setName(tokenName as string);
    if (tokenSymbol) setSymbol(tokenSymbol as string);
    if (tokenTotalSupply !== undefined) setTotalSupply(BigInt(tokenTotalSupply.toString()));
    if (tokenMaxSupply !== undefined) setMaxSupply(BigInt(tokenMaxSupply.toString()));
    if (accountBalance !== undefined) setBalance(BigInt(accountBalance.toString()));
    if (currentVotes !== undefined) setVotingPower(BigInt(currentVotes.toString()));
    if (currentDelegate) setDelegate(currentDelegate as Address);
  }, [tokenName, tokenSymbol, tokenTotalSupply, tokenMaxSupply, accountBalance, currentVotes, currentDelegate]);

  // Fetch owned NFTs
  const fetchOwnedNFTs = useCallback(async () => {
    if (!contractAddress || !account || !accountBalance) return;

    try {
      const nfts: NFT[] = [];
      const balance = Number(accountBalance);

      for (let i = 0; i < balance; i++) {
        const tokenId = await fetchTokenOfOwnerByIndex(account, i);
        if (tokenId !== null) {
          const nft = await fetchNFT(tokenId);
          if (nft) {
            nfts.push(nft);
          }
        }
      }

      setOwnedNFTs(nfts);
    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
    }
  }, [contractAddress, account, accountBalance]);

  // Fetch token ID by index for an owner
  const fetchTokenOfOwnerByIndex = useCallback(async (owner: Address, index: number): Promise<bigint | null> => {
    if (!contractAddress) return null;
    
    try {
      const { data } = await refetchTokenOfOwnerByIndex({ 
        args: [owner, BigInt(index)] 
      });
      return data ? BigInt(data.toString()) : null;
    } catch (error) {
      console.error('Error fetching token of owner by index:', error);
      return null;
    }
  }, [contractAddress]);

  const {
    refetch: refetchTokenOfOwnerByIndex,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'tokenOfOwnerByIndex',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Fetch NFT details
  const fetchNFT = useCallback(async (tokenId: bigint): Promise<NFT | null> => {
    if (!contractAddress) return null;
    
    try {
      const { data: owner } = await refetchOwnerOf({ args: [tokenId] });
      const { data: tokenURI } = await refetchTokenURI({ args: [tokenId] });
      const { data: approved } = await refetchGetApproved({ args: [tokenId] });

      return {
        tokenId,
        owner: owner as Address,
        tokenURI: tokenURI as string,
        approved: approved as Address,
      };
    } catch (error) {
      console.error('Error fetching NFT:', error);
      return null;
    }
  }, [contractAddress]);

  const {
    refetch: refetchOwnerOf,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'ownerOf',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  const {
    refetch: refetchTokenURI,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'tokenURI',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  const {
    refetch: refetchGetApproved,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'getApproved',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Get voting power at a specific block
  const getVotesAtBlock = useCallback(async (account: Address, blockNumber: bigint): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchPastVotes({ 
        args: [account, blockNumber] 
      });
      return BigInt(data?.toString() || '0');
    } catch (error) {
      console.error('Error getting past votes:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchPastVotes,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'getPastVotes',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Transfer NFT
  const transferNFT = useCallback(async (from: Address, to: Address, tokenId: bigint) => {
    if (!transfer) {
      throw new Error('Contract not initialized');
    }

    try {
      const txHash = await transfer({
        address: contractAddress!,
        abi: erc721VotingPower,
        functionName: 'safeTransferFrom',
        args: [from, to, tokenId],
      });
      return txHash;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }, [contractAddress, transfer]);

  // Approve address to manage NFT
  const approveAddress = useCallback(async (to: Address, tokenId: bigint) => {
    if (!approve) {
      throw new Error('Contract not initialized');
    }

    try {
      const txHash = await approve({
        address: contractAddress!,
        abi: erc721VotingPower,
        functionName: 'approve',
        args: [to, tokenId],
      });
      return txHash;
    } catch (error) {
      console.error('Error approving address:', error);
      throw error;
    }
  }, [contractAddress, approve]);

  // Set approval for all tokens
  const setOperatorApproval = useCallback(async (operator: Address, approved: boolean) => {
    if (!setApprovalForAll) {
      throw new Error('Contract not initialized');
    }

    try {
      const txHash = await setApprovalForAll({
        address: contractAddress!,
        abi: erc721VotingPower,
        functionName: 'setApprovalForAll',
        args: [operator, approved],
      });
      return txHash;
    } catch (error) {
      console.error('Error setting operator approval:', error);
      throw error;
    }
  }, [contractAddress, setApprovalForAll]);

  // Delegate voting power
  const delegateVotingPower = useCallback(async (delegatee: Address) => {
    if (!delegateVotes) {
      throw new Error('Contract not initialized');
    }

    try {
      const txHash = await delegateVotes({
        address: contractAddress!,
        abi: erc721VotingPower,
        functionName: 'delegate',
        args: [delegatee],
      });
      
      // Update local state
      setDelegate(delegatee);
      
      return txHash;
    } catch (error) {
      console.error('Error delegating votes:', error);
      throw error;
    }
  }, [contractAddress, delegateVotes]);

  // Mint new NFT (only for accounts with MINTER_ROLE)
  const mintNFT = useCallback(async (to: Address): Promise<bigint> => {
    if (!mint) {
      throw new Error('Contract not initialized');
    }

    try {
      const txHash = await mint({
        address: contractAddress!,
        abi: erc721VotingPower,
        functionName: 'mint',
        args: [to],
      });
      
      // In a real app, you would wait for the transaction to be mined
      // and then get the token ID from the transaction receipt
      // For now, we'll just return 0 as a placeholder
      return 0n;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }, [contractAddress, mint]);

  // Get token URI
  const getTokenURI = useCallback(async (tokenId: bigint): Promise<string> => {
    if (!contractAddress) return '';
    
    try {
      const { data } = await refetchTokenURI({ args: [tokenId] });
      return data as string;
    } catch (error) {
      console.error('Error getting token URI:', error);
      return '';
    }
  }, [contractAddress]);

  // Check if an address is approved for all tokens
  const isApprovedForAll = useCallback(async (owner: Address, operator: Address): Promise<boolean> => {
    if (!contractAddress) return false;
    
    try {
      const { data } = await refetchIsApprovedForAll({ 
        args: [owner, operator] 
      });
      return data as boolean;
    } catch (error) {
      console.error('Error checking approval for all:', error);
      return false;
    }
  }, [contractAddress]);

  const {
    refetch: refetchIsApprovedForAll,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'isApprovedForAll',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Get past total supply at a specific block
  const getPastTotalSupply = useCallback(async (blockNumber: bigint): Promise<bigint> => {
    if (!contractAddress) return 0n;
    
    try {
      const { data } = await refetchPastTotalSupply({ 
        args: [blockNumber] 
      });
      return BigInt(data?.toString() || '0');
    } catch (error) {
      console.error('Error getting past total supply:', error);
      return 0n;
    }
  }, [contractAddress]);

  const {
    refetch: refetchPastTotalSupply,
  } = useReadContract({
    address: contractAddress,
    abi: erc721VotingPower,
    functionName: 'getPastTotalSupply',
    query: {
      enabled: false, // We'll call this manually
    },
  });

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      refetchName(),
      refetchSymbol(),
      refetchTotalSupply(),
      refetchMaxSupply(),
      account && refetchBalance(),
      account && refetchVotes(),
      account && refetchDelegate(),
      account && fetchOwnedNFTs(),
    ]);
  }, [
    refetchName,
    refetchSymbol,
    refetchTotalSupply,
    refetchMaxSupply,
    refetchBalance,
    refetchVotes,
    refetchDelegate,
    fetchOwnedNFTs,
    account,
  ]);

  return {
    // State
    name,
    symbol,
    totalSupply,
    maxSupply,
    balance,
    votingPower,
    ownedNFTs,
    delegate,
    isLoading: !name || !symbol,
    isTransferring,
    isApproving,
    isSettingApprovalForAll,
    isDelegating,
    isMinting,
    error: transferError || approveError || approvalForAllError || delegateError || mintError,

    // Actions
    transfer: transferNFT,
    approve: approveAddress,
    setApprovalForAll: setOperatorApproval,
    delegateVotes: delegateVotingPower,
    mint: mintNFT,
    getTokenURI,
    getVotesAtBlock,
    getPastTotalSupply,
    isApprovedForAll,
    fetchNFT,
    refresh,

    // Raw contract interactions (use with caution)
    contract: {
      address: contractAddress,
      abi: erc721VotingPower,
    },
  };
}

// export default useERC721VotingPower;