// components/CustomConnectButton.tsx
"use client"

import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { CustomButton } from "./ui/CustomButton"

export function CustomConnectButton() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()

  return (
    <CustomButton
      label={isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect---==---Wallet"}
      onClick={() => open({ view: "Connect" })}
      variant="primary"
    />
  )
}
