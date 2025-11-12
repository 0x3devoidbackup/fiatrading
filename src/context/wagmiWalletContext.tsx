'use client'

import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useWalletClient, useSwitchChain, useChainId } from 'wagmi'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { UserRejectedRequestError } from 'viem'
import { base } from 'wagmi/chains'


interface WalletContextValue {
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  signer: JsonRpcSigner | null
  provider: BrowserProvider | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  error: string | null
  isCorrectNetwork: boolean
  switchToBase: () => Promise<void>
  chainId: number | undefined
}

const WalletContext = createContext<WalletContextValue>(
  {
    address: undefined,
    isConnected: false,
    isConnecting: false,
    signer: null,
    provider: null,
    connectWallet: async () => { },
    disconnectWallet: async () => { },
    error: null,
    isCorrectNetwork: false,
    switchToBase: async () => { },
    chainId: undefined
  }
)

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

// Helper function to detect if we're in Farcaster
const isFarcasterEnvironment = () => {
  if (typeof window === 'undefined') return false
  
  return (
    window.top !== window.self || 
    (window as unknown as { ethereum?: { isFarcaster?: boolean } }).ethereum?.isFarcaster ||
    document.referrer.includes('farcaster') ||
    (window as unknown as { farcaster?: unknown }).farcaster !== undefined
  )
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()
  const chainId = useChainId()
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if user is on the correct network (Base)
  const isCorrectNetwork = chainId === base.id

  // Auto-switch to Base network when connected to wrong network
  useEffect(() => {
    const autoSwitchNetwork = async () => {
      if (isConnected && !isCorrectNetwork && switchChainAsync) {
        try {
          console.log(`Wrong network detected (chainId: ${chainId}). Switching to Base...`)
          await switchChainAsync({ chainId: base.id })
        } catch (err) {
          console.error("Failed to auto-switch network:", err)
          if (err instanceof Error) {
            setError(`Please switch to Base network. ${err.message}`)
          }
        }
      }
    }

    autoSwitchNetwork()
  }, [isConnected, isCorrectNetwork, chainId, switchChainAsync])

  useEffect(() => {
    const setupProviderAndSigner = async () => {
      if (isConnected && walletClient && isCorrectNetwork) {
        try {
          const ethersProvider = new BrowserProvider(walletClient)
          setProvider(ethersProvider)

          const ethSigner = await ethersProvider.getSigner()
          setSigner(ethSigner)
          setError(null)
        } catch (err) {
          console.error("Failed to setup provider and signer:", err)
          setSigner(null)
          setProvider(null)
          setError("Failed to setup wallet provider")
        }
      } else {
        setSigner(null)
        setProvider(null)
      }
    }

    setupProviderAndSigner()
  }, [isConnected, walletClient, isCorrectNetwork])

  const switchToBase = useCallback(async () => {
    try {
      setError(null)
      if (!switchChainAsync) {
        setError("Network switching not available")
        return
      }
      await switchChainAsync({ chainId: base.id })
    } catch (err) {
      if (err instanceof UserRejectedRequestError) {
        setError("Network switch was rejected. Please switch to Base network manually.")
      } else if (err instanceof Error) {
        setError(err.message || "Failed to switch network")
      } else {
        setError("Failed to switch network")
      }
      console.error("Failed to switch network:", err)
    }
  }, [switchChainAsync])

  const connectWallet = useCallback(async () => {
    try {
      setError(null)
      
      if (!connectors || connectors.length === 0) {
        setError("No wallet connectors available")
        console.error("No connectors available")
        return
      }

      console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })))

      const inFarcaster = isFarcasterEnvironment()
      console.log("In Farcaster environment:", inFarcaster)
      
      let selectedConnector
      
      if (inFarcaster) {
        selectedConnector = connectors.find(c => 
          c.id === 'farcaster' || 
          c.id === 'farcasterMiniApp' || 
          c.name?.toLowerCase().includes('farcaster')
        )
        
        if (!selectedConnector) {
          console.warn("Farcaster connector not found, using first available")
          selectedConnector = connectors[0]
        }
      } else {
        selectedConnector = connectors.find(c => 
          c.id === 'io.metamask' ||
          c.name?.toLowerCase().includes('metamask')
        )
        
        if (!selectedConnector) {
          selectedConnector = connectors.find(c => 
            c.id === 'injected' || 
            c.name?.toLowerCase().includes('injected')
          )
        }
        
        if (!selectedConnector) {
          selectedConnector = connectors.find(c => 
            c.id === 'coinbaseWalletSDK' || 
            c.name?.toLowerCase().includes('coinbase')
          )
        }

        if (!selectedConnector) {
          selectedConnector = connectors.find(c => 
            c.id === 'walletConnect' || 
            c.name?.toLowerCase().includes('walletconnect')
          )
        }
        
        if (!selectedConnector) {
          selectedConnector = connectors.find(c => 
            c.id !== 'farcaster' &&
            c.id !== 'farcasterMiniApp' && 
            !c.name?.toLowerCase().includes('farcaster')
          )
        }

        if (!selectedConnector) {
          selectedConnector = connectors[0]
        }
      }

      console.log("Selected connector:", selectedConnector?.name, selectedConnector?.id)
      
      if (!selectedConnector) {
        setError("No suitable connector found")
        return
      }

      // Connect with the Base chain explicitly
      await connectAsync({ 
        connector: selectedConnector,
        chainId: base.id 
      })
      console.log("Connection successful")
    } catch (err) {
      if (err instanceof UserRejectedRequestError) {
        setError("Connection request was rejected. Please make sure your wallet is unlocked and has at least one account.")
      } else if (err instanceof Error) {
        if (err.message.includes('at least one account')) {
          setError("Please unlock your wallet and make sure you have at least one account created.")
        } else if (err.message.includes('User rejected')) {
          setError("Connection was rejected. Please try again and approve the connection request.")
        } else {
          setError(err.message || "Failed to connect wallet")
        }
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
      console.error("Failed to connect wallet:", err)
    }
  }, [connectAsync, connectors])

  const disconnectWallet = useCallback(async () => {
    try {
      setError(null)
      await disconnectAsync()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to disconnect wallet")
      } else {
        setError("Failed to disconnect wallet")
      }
      console.error("Failed to disconnect wallet:", err)
    }
  }, [disconnectAsync])

  const value = {
    address,
    isConnected,
    isConnecting,
    signer,
    provider,
    connectWallet,
    disconnectWallet,
    error,
    isCorrectNetwork,
    switchToBase,
    chainId
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}