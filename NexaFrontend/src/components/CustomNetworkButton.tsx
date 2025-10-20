// components/CustomNetworkButton.tsx
"use client";

import { useAppKit } from "@reown/appkit/react";
import { useChainId, useAccount } from "wagmi";
import { celoSepolia, baseSepolia } from "viem/chains";
import { CustomButton } from "./ui/CustomButton";
import Image from "next/image";

export function CustomNetworkButton() {
  const { open } = useAppKit();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  return (
    <CustomButton
      icon={
        chainId === celoSepolia.id ? (
          <Image
            src="/celo.png"
            alt="Celo Sepolia"
            width={24}
            height={24}
            className="rounded-full object-contain mr-1"
          />
        ) : chainId === baseSepolia.id ? (
          <Image
            src="/base.png"
            alt="Base Sepolia"
            width={24}
            height={24}
            className="rounded-full object-contain mr-1"
          />
        ) : null
      }
      label={
        chainId === celoSepolia.id
          ? "Celo Sepolia"
          : chainId === baseSepolia.id
          ? "Base Sepolia"
          : isConnected
          ? "Unsupported Network"
          : "Select Network"
      }
      onClick={() => open({ view: "Networks" })}
      variant="secondary"
    />
  );
}
