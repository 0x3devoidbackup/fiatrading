"use client"
import React, { useEffect, useState } from 'react';
import { Loader2, Coins, TrendingUp, Users, Award, Flame, Wallet, Check, X, Clock, ExternalLink, Lock, Trophy } from 'lucide-react';
import { ConnectWalletButton } from "@/utils/connectWallet"
import { applyGrants, getGrants, TopStakers, formatNumber, getTotalStaked, FormattedGrant, fetchSevenPercentage, getEthBalanceInUSDT } from '@/utils/blockFunctions';
import { useWallet } from '@/context/walletContext'
import StakeTokens from './stake';
import { notifyInfo, notifySuccess } from '@/utils/notify';
import { DEV_WALLET } from '@/config/contracts';
import GrantCard from "./grantcard"
interface Staker {
  address: string;
  amount: number;
  rank: number;
}

const App = () => {
  const { isConnected, connectWallet, address, signer } = useWallet();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'grants' | 'apply' | 'stake'>('dashboard');

  // Form state
  const [projectName, setProjectName] = useState('');
  const [tokenCA, setTokenCA] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  // const [depositRequired, setDepositRequired] = useState('');
  const [socials, setSocials] = useState({
    twitter: '',
    telegram: '',
    website: '',
    farcaster: ''
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Mock data
  const [treasuryBalance, settreasuryBalance] = useState(0);
  const [availableForGrants, setavailableForGrants] = useState(0);
  const [totalStaked, settotalStaked] = useState(0);



  const taxRate = { buy: 3, sell: 3 };

  const [grants, setGrants] = useState<FormattedGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [topStakers, settopStakers] = useState<Staker[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const fetchData = async () => {
    try {

      const formattedGrants = await getGrants();
      setGrants(formattedGrants);
      const stakers = await TopStakers()
      settopStakers(stakers);
      const total = await getTotalStaked();
      settotalStaked(Number(total))
      const {
        balanceETH,
        balanceUSDT,
      } = await getEthBalanceInUSDT(DEV_WALLET)

      const grantAmount = Number(balanceUSDT) * 0.5;
      settreasuryBalance(Number(balanceUSDT))
      setavailableForGrants(grantAmount)

    } catch (error) {
      console.error("Error fetching grants:", error);
    }

  };






  async function handleGrantApplication(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }
    if (!tokenCA.trim()) {
      setError('Token contract address is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!purpose.trim()) {
      setError('Purpose is required');
      return;
    }
    if (!requestedAmount || parseFloat(requestedAmount) <= 0) {
      setError('Valid requested amount is required');
      return;
    }

    if (!socials.twitter.trim() || !socials.telegram.trim() || !socials.website.trim() || !socials.farcaster.trim()) {
      setError('Twitter, Website , farcaster and Telegram are required');
      return;
    }

    if (!signer) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setIsSubmitting(true);
      const depositRequired = await fetchSevenPercentage(tokenCA);
      if (!depositRequired) {
        setError('Please provide a valid token contract address');
        return;
      }


      const result = await applyGrants(
        signer,
        projectName,
        tokenCA,
        description,
        purpose,
        parseFloat(requestedAmount),
        parseFloat(String(depositRequired)),
        socials.website,
        socials.twitter,
        socials.telegram,
        socials.farcaster
      );

      setSuccess(`Grant application submitted successfully!`);

      // Reset form
      setProjectName('');
      setTokenCA('');
      setDescription('');
      setPurpose('');
      setRequestedAmount('');
      setSocials({
        twitter: '',
        telegram: '',
        website: '',
        farcaster: ''
      });

      await fetchData();
      setTimeout(() => {
        fetchData();
        setActiveTab("grants");
      }, 10_000);

    } catch (error) {
      console.error('Error applying for grant:', error);
      setError('Failed to submit grant application');
    } finally {
      setIsSubmitting(false);
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0c0e13]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-white text-sm font-medium">Loading, please wait...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto px-2 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  GRANT
                </h1>
                <p className="text-xs text-gray-500 font-bold">Community Governed Grants</p>
              </div>
            </div>

            <div className="flex items-center gap-6">

              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-start lg:justify-center">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'grants', label: 'Grants', icon: Award },
              { id: 'apply', label: 'Apply', icon: ExternalLink },
              { id: 'stake', label: 'Stake', icon: Lock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "dashboard" | "grants" | "apply" | "stake")}
                className={`cursor-pointer px-4 py-4 font-bold text-xs lg:text-sm transition-all flex items-center gap-2 relative ${activeTab === tab.id
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Coins className="w-10 h-10 opacity-80" />
                  <div className="text-right">
                    <div className="text-sm opacity-90 font-medium">Treasury Balance</div>
                    <div className="text-3xl font-bold">${formatNumber(treasuryBalance)}</div>
                  </div>
                </div>
                <div className="text-xs opacity-75">3% buy / 3% sell tax → Treasury</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-green-600" />
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Available Grants</div>
                    <div className="text-3xl font-bold text-gray-900">${formatNumber(availableForGrants)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">50% of treasury pool</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-purple-600" />
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Total Staked</div>
                    <div className="text-3xl font-bold text-gray-900">{formatNumber(totalStaked)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Tokens staked by community</div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                Tokenomics Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="text-5xl font-bold text-green-600 mb-2">{taxRate.buy}%</div>
                  <div className="text-sm font-semibold text-green-900">Buy Tax</div>
                  <div className="text-xs text-green-700 mt-1">→ Grant Pool</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                  <div className="text-5xl font-bold text-red-600 mb-2">{taxRate.sell}%</div>
                  <div className="text-sm font-semibold text-red-900">Sell Tax</div>
                  <div className="text-xs text-red-700 mt-1">→ Grant Pool</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                  <div className="text-5xl font-bold text-purple-600 mb-2">7%</div>
                  <div className="text-sm font-semibold text-purple-900">Recipient Deposit</div>
                  <div className="text-xs text-purple-700 mt-1">Before disbursement</div>
                </div>
              </div>
            </div>

            {/* Top Stakers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                Top 20 Stakers
                <span className="text-sm font-normal text-gray-500">(Airdrop Eligible)</span>
              </h2>
              <div className="space-y-3">
                {topStakers.map(staker => (
                  <div
                    key={staker.address}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${staker.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                        staker.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                          staker.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700'
                        }`}>
                        #{staker.rank}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-gray-900">{staker.address}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Eligible for deposit airdrops
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{formatNumber(staker.amount)}</div>
                      <div className="text-xs text-gray-500">tokens staked</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Grant Applications</h2>
                <p className="text-gray-600 text-xs">Vote on proposals using your tokens (tokens will be burned)</p>
              </div>
              <button
                onClick={() => setActiveTab('apply')}
                className="px-4 cursor-pointer py-2 bg-gradient-to-r text-xs from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                Apply
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {grants.map(grant => (
                <GrantCard key={grant.id} grant={grant} handleRefreshData={fetchData} />
              ))}
            </div>
          </div>
        )}



        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Grant</h2>
              <p className="text-gray-600 mb-8">Submit your project for community consideration</p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleGrantApplication}>
                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="Enter your project name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Token CA */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Token CA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tokenCA}
                      onChange={(e) => setTokenCA(e.target.value)}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="0x..."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm resize-none"
                      placeholder="Tell us about your project..."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Purpose of Grant */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Purpose of Grant <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm resize-none"
                      placeholder="What will the grant be used for..."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Requested Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Requested Amount (USDT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="0"
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum available: 1000 USDT
                    </p>
                  </div>



                  {/* SOCIALS */}
                  <div className='mt-5'>
                    <label className="block text-sm text-black font-semibold mb-2">
                      SOCIAL LINKS
                    </label>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Twitter */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Twitter / X <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://x.com/username"
                          value={socials.twitter}
                          onChange={(e) =>
                            setSocials({ ...socials, twitter: e.target.value })
                          }
                          required
                          disabled={isSubmitting}
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>

                      {/* Telegram */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Telegram <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://t.me/username"
                          value={socials.telegram}
                          required
                          onChange={(e) =>
                            setSocials({ ...socials, telegram: e.target.value })
                          }
                          disabled={isSubmitting}
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Website <span className="text-red-500">*</span></label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={socials.website}
                          onChange={(e) =>
                            setSocials({ ...socials, website: e.target.value })
                          }
                          disabled={isSubmitting}
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>

                      {/* Farcaster */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Farcaster <span className="text-red-500">*</span></label>
                        <input
                          type="url"
                          placeholder="https://warpcast.com/username"
                          value={socials.farcaster}
                          onChange={(e) =>
                            setSocials({ ...socials, farcaster: e.target.value })
                          }
                          disabled={isSubmitting}
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Requirements Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Grant Requirements
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                        Community votes using tokens (all votes burned)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                        If approved, deposit 7% of token supply before receiving grant
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                        Portion of 7% deposit airdropped to top 20 stakers
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm 
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'stake' && (
          <StakeTokens handleRefreshData={fetchData} />
        )}
      </main>
    </div>
  );
};

export default App;