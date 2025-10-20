// components/CustomNetworkButton.tsx
"use client"

import { useAppKit, useAppKitNetwork } from "@reown/appkit/react"
import { CustomButton } from "./ui/CustomButton"
import { useEffect, useState } from "react"

export function CustomNetworkButton() {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork()
  const [networkIcon, setNetworkIcon] = useState<React.ReactNode>(null)

  useEffect(() => {
    if (caipNetwork.) {
      setNetworkIcon(caipNetwork.icon)
    }
  }, [caipNetwork])

  return (
    <CustomButton
      icon={networkIcon ? <img src={networkIcon} alt="" /> : null}
      label={caipNetwork ? caipNetwork.name : "Select Network"}
      onClick={() => open({ view: "Networks" })}
      variant="secondary"
    />
  )
}
