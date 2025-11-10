import { useWallet } from '@/context/walletContext'
import {Wallet} from 'lucide-react'

export const ConnectWalletButton: React.FC = () => {
    const { isConnected, connectWallet, address } = useWallet();

    return (

        <button onClick={connectWallet} className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2" >
            <Wallet className="w-4 h-4" />
            <p className='text-sm ' > {isConnected ? formatAddress(address ? address : "Reconnect wallet") : "Connect"} </p>
        </button>
    );

};

export const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}
