'use client'
import React, { useEffect, useState } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import {
    useWeb3Modal,
    useWeb3ModalAccount,
    useWeb3ModalProvider
} from '@web3modal/ethers/react';
import { BrowserProvider } from 'ethers';
import { CHAINS } from './config/chain'


type ChainConfig = (typeof CHAINS)[number];
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2a82896056cb711244ed72df1bc4eae0e2d4'

// Metadata for your app
const metadata = {
    name: 'Pumpevm',
    description: 'A decentralized exchange',
    url: 'https://pumpevm.vercel.app',
    icons: ['']
}

// Ethers configuration
const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: CHAINS[0].rpcUrl[0],
    defaultChainId: CHAINS[0]?.chainId,
});


createWeb3Modal({
    ethersConfig,
    chains: [CHAINS[0]],
    projectId,
    metadata,
    enableAnalytics: true,
    themeVariables: {
        "--w3m-color-mix": "#000",
        "--w3m-color-mix-strength": 5,
        "--w3m-border-radius-master": "2px",
        "--w3m-accent": "rgba(81, 252, 139, 0.79)",
    },
})

// Hook to handle chain switching and adding
export const useChainManager = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { chainId, isConnected } = useWeb3ModalAccount();
    const [currentChainId, setCurrentChainId] = useState(999);

    useEffect(() => {
        if (isConnected && chainId) {
            setCurrentChainId(999);
        }
    }, [chainId, isConnected]);

    const addChainToWallet = async (chainConfig: ChainConfig) => {
        if (!walletProvider) {
            throw new Error('Wallet not connected');
        }

        try {
            const provider = new BrowserProvider(walletProvider);

            const chainIdHex = `0x${chainConfig.chainId.toString(16)}`;

            const chainParams = {
                chainId: chainIdHex,
                chainName: chainConfig.name,
                nativeCurrency: chainConfig.currency,
                rpcUrls: chainConfig.rpcUrl,
                blockExplorerUrls: chainConfig.explorerUrl,
            };

            await provider.send('wallet_addEthereumChain', [chainParams]);

            //   showSuccessToast(`Successfully added ${chainConfig.chainName} to wallet`);
            return true;
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error) {
                const e = error as { code?: number; message?: string };

                if (e.code === 4902) {
                    throw new Error("Chain not supported by wallet");
                } else if (e.code === 4001) {
                    throw new Error("User rejected the request");
                } else {
                    throw new Error(`Failed to add chain: ${e.message ?? "Unknown error"}`);
                }
            }
            throw error;
        }
    };

    // Function to switch to a specific chain
    const switchToChain = async (targetChainId: number) => {
        if (!walletProvider) {
            throw new Error('Wallet not connected');
        }

        try {
            const provider = new BrowserProvider(walletProvider);
            const chainIdHex = `0x${targetChainId.toString(16)}`;

            // Try to switch chain first
            await provider.send('wallet_switchEthereumChain', [
                { chainId: chainIdHex }
            ]);

            //   showSuccessToast(`Successfully switched to chain ${targetChainId}`);
            return true;
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error) {
                const e = error as { code?: number; message?: string };

                if (e.code === 4902) {
                    throw new Error("Chain not supported by wallet");
                } else if (e.code === 4001) {
                    throw new Error("User rejected the request");
                } else {
                    throw new Error(`Failed to add chain: ${e.message ?? "Unknown error"}`);
                }
            }
            throw error; // rethrow if it's not the expected error object
        }
    };

    // Function to check if current chain is supported
    const isChainSupported = (chainId: number) => {
        return CHAINS.some(chain => chain.chainId === chainId);
    };

    // Function to get chain details
    const getChainDetails = (chainId: number) => {
        return CHAINS.find(chain => chain.chainId === chainId);
    };

    return {
        currentChainId,
        addChainToWallet,
        switchToChain,
        isChainSupported,
        getChainDetails,
        supportedChains: CHAINS,
    };
};
