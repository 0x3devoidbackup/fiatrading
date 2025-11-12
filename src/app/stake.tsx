'use client'
import { useWallet } from '@/context/wagmiWalletContext'
import React, { useState, useEffect } from 'react'
import { Lock, Trophy, Flame } from 'lucide-react';
import { formatNumber, approveToken, unstakeTokens, stakeTokens, fetchUserTokenBalance } from '@/utils/blockFunctions';
import { notifySuccess, notifyError, notifyInfo } from '@/utils/notify';


interface GrantCardProps {
    handleRefreshData: () => void;
}
const StakeTokens: React.FC<GrantCardProps> = ({ handleRefreshData }) => {
    const { isConnected, connectWallet, address, signer } = useWallet();

    const [userBalance, setUserbalance] = useState("0")
    const [userStaked, setUserStaked] = useState("0")

    const [inputAMount, setInputAmount] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);

    const [showUnstakeModal, setShowunstake] = useState(false)


    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        if (!isConnected || !signer || !address) return;

        try {
            const { formattedBalance, fomatToken } = await fetchUserTokenBalance(signer, address);
            setUserbalance(formattedBalance);
            setUserStaked(fomatToken)
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    }

    async function handleStake() {
        if (!isConnected || !signer || !address) return;
        const amount = Number(inputAMount)
        if (amount <= 0) {
            notifyInfo("Amount can not be less than Min")
            return
        }
        try {
            setIsSubmitting(true);
            await approveToken(amount, signer, address)
            await stakeTokens(signer, amount)
            notifySuccess("Staking has been completed.")
            setInputAmount("")
            await fetchData();
            await handleRefreshData()
            setTimeout(() => {
                fetchData();
                handleRefreshData()
            }, 10_000);

        } catch (error) {
            notifyError("An error occured while trying to stake")
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUstaking() {
        if (!isConnected || !signer || !address) return;
        const amount = Number(userStaked)
        if (amount <= 0) {
            notifyInfo("Amount can not be less than Min")
            return
        }
        try {
            setIsUnstaking(true);
            await unstakeTokens(signer, amount)
            notifySuccess("Unstaking has been completed.")
            setUserStaked("0")
            setShowunstake(false)
            await fetchData();
            await handleRefreshData()
            setTimeout(() => {
                fetchData();
                handleRefreshData()
            }, 10_000);


        } catch (error) {
            notifyError("An error occured while trying to unstake")
        } finally {
            setIsUnstaking(false);
        }
    }
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Stake Your Tokens</h2>
                <p className="text-gray-600 mb-8">Become a top staker and earn airdrop rewards</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-purple-100">
                        <div className="text-sm font-semibold text-purple-600 mb-1">Available Balance</div>
                        <div className="text-4xl font-bold text-gray-900">{formatNumber(userBalance.toLocaleString())}</div>
                        <div className="text-xs text-gray-500 mt-1">tokens</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-2xl text-white cursor-pointer" onClick={() => { setShowunstake(true) }} >
                        <div className="text-sm font-semibold opacity-90 mb-1">Currently Staked</div>
                        <div className="text-4xl font-bold">{formatNumber(userStaked.toLocaleString())}</div>
                        <div className="text-xs opacity-75 mt-1">tokens locked</div>
                    </div>
                </div>

                {showUnstakeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Unstake Tokens
                            </h3>


                            <div className="mb-6">

                                <input
                                    type="number"
                                    value={userStaked}
                                    disabled
                                    placeholder="0"
                                    className="w-full px-4 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                                />

                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <Flame className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900">Unstaked tokens will be sent directly to stakers wallet.</p>
                                    <p className="text-xs text-red-700">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowunstake(false) }}
                                    className="flex-1 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUstaking}

                                    disabled={isUnstaking}
                                    className={`flex-1 py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2  ${isUnstaking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Amount to Stake
                        </label>
                        <input
                            type="number"
                            value={inputAMount}
                            onChange={((e) => setInputAmount(e.target.value))}
                            placeholder="0"
                            className="w-full px-3 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl font-bold transition-all"
                            required
                            disabled={isSubmitting}
                        />
                        <div className="flex gap-2 mt-3">
                            {[25, 50, 75, 100].map(pct => (
                                <button
                                    onClick={() => {
                                        if (!userBalance) return; // ensure balance exists
                                        const calculated = ((Number(userBalance) * pct) / 100).toFixed(1);
                                        setInputAmount(calculated);
                                    }}
                                    key={pct}
                                    className="flex-1 text-[12px] px-2 py-1 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg font-bold text-gray-700 transition-all"
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            Staking Benefits
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0"></div>
                                Top 20 stakers receive airdrops from 7% grant recipient deposits
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0"></div>
                                Increased governance power and voting influence
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0"></div>
                                Support community projects and ecosystem growth
                            </li>
                        </ul>
                    </div>

                    {isConnected ? <button disabled={isSubmitting} className={`w-full py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`} onClick={handleStake}>
                        <Lock className="w-5 h-5" />
                        {isSubmitting ? 'Staking...' : 'Stake Tokens'}
                    </button> : <button className="w-full py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2" onClick={connectWallet}>
                        Connect wallet
                    </button>}


                </div>
            </div>
        </div>
    )
}

export default StakeTokens
