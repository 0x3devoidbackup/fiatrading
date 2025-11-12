'use client'
import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  },
  connectors: [
    injected(), // MetaMask, Rainbow, and other injected wallets - MUST be before Farcaster
    coinbaseWallet({
      appName: 'GrantDao',
    }),
    miniAppConnector(), // Farcaster - should be last
  ],
  ssr: true,
})