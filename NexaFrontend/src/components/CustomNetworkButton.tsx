// components/CustomNetworkButton.tsx
"use client"

import { useAppKit, useAppKitNetwork } from "@reown/appkit/react"
import { CustomButton } from "./ui/CustomButton"

export function CustomNetworkButton() {
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()

  return (
    <CustomButton
      label={chainId ? chainId.toString() : "Select Network"}
      onClick={() => open({ view: "Networks" })}
      variant="secondary"
    />
  )
}
