// components/CustomNetworkButton.tsx
"use client"

import { useAppKit, useAppKitNetwork } from "@reown/appkit/react"
import { CustomButton } from "./ui/CustomButton"

export function CustomNetworkButton() {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork()

  return (
    <CustomButton
      
      label={caipNetwork ? caipNetwork.name : "Select Network"}
      onClick={() => open({ view: "Networks" })}
      variant="secondary"
    />
  )
}
