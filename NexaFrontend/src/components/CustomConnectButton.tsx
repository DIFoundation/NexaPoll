// components/CustomConnectButton.tsx
"use client"

import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { CustomButton } from "./ui/CustomButton"

export function CustomConnectButton() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()

  const handleClick = () => {
    open({ view: "Account" })
  }

  return (
    <CustomButton
      label={isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect---==---Wallet"}
      onClick={handleClick}
      variant="primary"
    />
  )
}
