'use client'
import { AppKitConnectButton } from '@reown/appkit/react'
import React from 'react'

function Header() {
  return (
    <div>
      <div>
        <p>1</p>
        <appkit-button />
      </div>

      <div>
        <p>2</p>
        <appkit-modal />
      </div>

      <div>
        <p>3</p>
        <appkit-connect-button />
      </div>

      <div>
        <p>4</p>
        <appkit-network-button />
      </div>

      <div>
        <p>5</p>
        <appkit-account-button />
      </div>

      <div>
        <p>6</p>
        <AppKitConnectButton />
      </div>
    </div>
  )
}

export default Header