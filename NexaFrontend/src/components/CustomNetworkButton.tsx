// components/CustomNetworkButton.tsx
"use client"

import { useAppKit } from "@reown/appkit/react"
import { useChainId, useAccount } from 'wagmi'
import { celoSepolia, baseSepolia } from 'viem/chains'
import { CustomButton } from "./ui/CustomButton"
import Image from "next/image"

// Chain configuration mapping
const CHAIN_CONFIG = {
  [celoSepolia.id]: {
    name: 'Celo Sepolia',
    icon: '/celo-sepolia-logo.svg'
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia',
    icon: '/base-sepolia-logo.svg'
  },
  // Add more chains as needed
}

export function CustomNetworkButton() {
  const { open } = useAppKit()
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
  // Get chain info from our mapping
  const chainInfo = chainId ? CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG] : null

  return (
    <CustomButton
      icon={
        chainInfo?.icon ? (
          <Image 
            src={chainInfo.icon} 
            alt={chainInfo.name || 'Network'} 
            width={24} 
            height={24} 
            className="rounded-full"
          />
        ) : null
      }
      label={chainInfo?.name || (isConnected ? 'Unsupported Network' : 'Select Network')}
      onClick={() => open({ view: "Networks" })}
      variant="secondary"
    />
  )
}
