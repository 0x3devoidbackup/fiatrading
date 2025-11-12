import { useWallet } from '@/context/wagmiWalletContext'
import { Wallet } from 'lucide-react'

export const ConnectWalletButton: React.FC = () => {
    const {
        isConnected,
        connectWallet,
        disconnectWallet,
        address,
        error,
        isCorrectNetwork,
        switchToBase,
        chainId,
        isConnecting
    } = useWallet()

    if (isConnected) {
        if (!isCorrectNetwork) {
            return (
                <div className="flex flex-col gap-2">
                    <div className="text-yellow-600 text-sm">
                        ⚠️ Wrong Network (Chain ID: {chainId})
                    </div>
                    <button
                        onClick={switchToBase}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        Switch to Base Network
                    </button>
                </div>
            )
        }

        return (
            <button onClick={disconnectWallet} className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-xl text-xs font-extrabold">
                Disconnect {address?.slice(0, 5)}...{address?.slice(-4)}
            </button>
        )
    }

    return (

        <button onClick={connectWallet} className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2" >
            <Wallet className="w-4 h-4" />
            <p className='text-sm ' >  Connect </p>
            {/* {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )} */}
        </button>
    );

};

export const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}


export default function ConnectButton() {
    const {
        isConnected,
        connectWallet,
        disconnectWallet,
        address,
        error,
        isCorrectNetwork,
        switchToBase,
        chainId
    } = useWallet()

    if (isConnected) {
        if (!isCorrectNetwork) {
            return (
                <div className="flex flex-col gap-2">
                    <div className="text-yellow-600 text-sm">
                        ⚠️ Wrong Network (Chain ID: {chainId})
                    </div>
                    <button
                        onClick={switchToBase}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        Switch to Base Network
                    </button>
                </div>
            )
        }

        return (
            <button onClick={disconnectWallet} className="bg-red-500 text-white px-4 py-2 rounded">
                Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={connectWallet}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Connect Wallet
            </button>
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
        </div>
    )
}