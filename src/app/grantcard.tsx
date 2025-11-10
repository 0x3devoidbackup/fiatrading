"use client"
import React, { useEffect, useState } from 'react';
import { applyGrants, formatNumber, getContractCapConstants, getTotalStaked, isUserVoted, FormattedGrant, fetchUserTokenBalance, voteOnGrant, approveToken } from '@/utils/blockFunctions';
import { Flame, Wallet, Check, X, Clock, ExternalLink, Lock, Trophy } from 'lucide-react';
import { useWallet } from '@/context/walletContext'
import { Redirect } from 'next';
import SocialLinks from "./SocialLinks";

interface GrantCardProps {
    grant: FormattedGrant;
    handleRefreshData: () => void;
}


const GrantCard: React.FC<GrantCardProps> = ({ grant, handleRefreshData }) => {
    const { isConnected, connectWallet, address, signer } = useWallet();

    const [maxVotesCap, setMaxVotesCap] = useState<number>(0)
    const [maxVotes, setMaxVotes] = useState<number>(0)
    const [minVotes, setMinVotes] = useState<number>(0)
    const [isVoting, setIsVoting] = useState(false);
    const [isVoted, setIsvoted] = useState(false)
    const [userBalance, setUserbalance] = useState("0")


    const [sterror, setStError] = useState('');
    const [stsuccess, setStSuccess] = useState('');
    const [voteAmount, setVoteAmount] = useState({
        amount: '',
        grantId: 0
    })



    useEffect(() => {

        fetchVoteData();
    }, []);

    async function fetchVoteData() {

        try {
            const {
                minVoteValue,
                maxVoteValue,
                voteCapValue
            } = await getContractCapConstants()

            setMaxVotesCap(Number(voteCapValue))
            setMaxVotes(Number(maxVoteValue))
            setMinVotes(Number(minVoteValue))
            console.log(voteCapValue)

        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    }


    useEffect(() => {


        fetchBalanceData();
    }, [isConnected, signer, address, grant.id]);

    async function fetchBalanceData() {
        if (!isConnected || !signer || !address) return;

        try {
            const { formattedBalance, fomatToken } = await fetchUserTokenBalance(signer, address);
            const voted = await isUserVoted(Number(grant.id), address)
            setUserbalance(formattedBalance);
            setIsvoted(voted)
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        }
    }



    const totalVotes = Number(grant.votes);
    const forPercentage = totalVotes > 0 ? (totalVotes / maxVotesCap) * 100 : 0;
    const [showVoteModal, setShowVoteModal] = useState(false);

    async function handleVote(
        e: React.FormEvent
    ) {
        e.preventDefault()
        setStError('');
        setStSuccess('');

        if (!isConnected || !signer || !address) return;
        if (!voteAmount || parseFloat(voteAmount.amount) <= 0) {
            setStError('Please enter a valid vote amount');
            return;
        }
        if (Number(voteAmount) < minVotes || Number(voteAmount) > maxVotes) {
            setStError('Vote amount cannot be less than Min or greater than Max');
            return;
        }

        if (Number(voteAmount.amount) > Number(userBalance)) {
            setStError('Insufficient balance');
            return;
        }

        try {
            setIsVoting(true);
            await approveToken(voteAmount.amount, signer, address)
            const { success, txHash } = await voteOnGrant(signer, voteAmount.grantId, Number(voteAmount.amount));

            if (success && txHash) {
                setStSuccess("Voting was successful ✅");
                setVoteAmount({ ...voteAmount, amount: "" })
                setShowVoteModal(false)
                await handleRefreshData();
                await fetchVoteData();
                await fetchBalanceData();
                setTimeout(() => {
                    handleRefreshData();
                    fetchVoteData();
                    fetchBalanceData();
                }, 10_000);

            }
        } catch (error) {
            console.error(error);
            setStError("An error occurred while processing vote");
            setVoteAmount({ ...voteAmount, amount: "" })
        } finally {
            setIsVoting(false);
        }
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{grant.projectName}</h3>
                            <p className="text-sm text-gray-500 font-mono">{grant.tokenCA}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${grant.status === 'voting' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                                grant.status === 'approved' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                                    grant.status === 'rejected' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                                        grant.status === 'completed' ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' :
                                            'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                                }`}>
                                {grant.status}
                            </span>
                            {grant.votingEndsAt && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Ends in {grant.votingEndsAt}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-1"><span className='font-extrabold'>Description:</span> {grant.description}</p>
                    <p className="text-gray-600 leading-relaxed mb-6"><span className='font-extrabold'>Purpose:</span> {grant.purpose}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                            <div className="text-xs font-semibold text-purple-600 mb-1">Requested</div>
                            <div className="text-2xl font-bold text-gray-900">${formatNumber(grant.requestedAmount)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                            <div className="text-xs font-semibold text-orange-600 mb-1">Deposit (7%)</div>
                            <div className="text-2xl font-bold text-gray-900">{formatNumber(grant.depositRequired)}</div>
                            <div className="text-xs text-gray-500">tokens required</div>
                        </div>
                    </div>

                    {grant.status === 'voting' && (
                        <>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {formatNumber(grant.votes)} $GRANT
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {formatNumber(maxVotesCap)} $GRANT
                                        </span>
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                        style={{ width: `${forPercentage}%` }}
                                    />
                                    <div
                                        className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-600 transition-all duration-500"
                                        style={{ width: `${100 - forPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs font-bold text-green-600">{forPercentage.toFixed(1)}%</span>
                                    <span className="text-xs font-bold text-red-600">{(100 - forPercentage).toFixed(1)}%</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {isConnected ?
                                    (
                                        isVoted ? <button
                                            disabled
                                            className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" />
                                            Voted
                                        </button>
                                            : <button
                                                onClick={() => { setShowVoteModal(true) }}
                                                className="flex-1 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-5 h-5" />
                                                Vote
                                            </button>

                                    )


                                    :
                                    <button
                                        onClick={connectWallet}
                                        className="flex-1 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Wallet className="w-5 h-5" />
                                        Connect wallet
                                    </button>}


                            </div>
                        </>
                    )}

                    <div className='mt-5'>
                        <SocialLinks
                            telegram={grant.socials.telegram}
                            twitter={grant.socials.twitter}
                            website={grant.socials.website}
                            farcaster={grant.socials.farcaster}
                        />
                    </div>

                </div>
            </div>

            {/* Vote Modal */}
            {showVoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Vote
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Enter the amount of tokens you want to vote with. These tokens will be burned.
                        </p>

                        {sterror && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {sterror}
                            </div>
                        )}

                        {/* Success Message */}
                        {stsuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                                {stsuccess}
                            </div>
                        )}

                        <form onSubmit={handleVote}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Vote Amount (Min: {formatNumber(minVotes)}, Max: {formatNumber(maxVotes)})
                                </label>
                                <input
                                    type="number"
                                    value={voteAmount.amount}
                                    onChange={(e) => setVoteAmount({ ...voteAmount, amount: e.target.value, grantId: Number(grant.id) })}
                                    placeholder="0"
                                    className="w-full px-4 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Available: {formatNumber(userBalance.toLocaleString())} tokens
                                </p>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <Flame className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900">Tokens will be burned</p>
                                    <p className="text-xs text-red-700">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowVoteModal(false) }}
                                    className="flex-1 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isVoting}
                                    type="submit"
                                    className={`flex-1 py-2 rounded-xl cursor-pointer font-bold transition-all ${isVoting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:shadow-lg"
                                        }`}
                                >
                                    {isVoting ? "Voting..." : "Confirm Votes"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default GrantCard
