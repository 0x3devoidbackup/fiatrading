"use client"
import React, { useState } from 'react';
import { ArrowUpRight, Coins, TrendingUp, Users, Award, Flame, Wallet, Check, X, Clock, ExternalLink, Lock, Trophy } from 'lucide-react';

type GrantStatus = 'pending' | 'voting' | 'approved' | 'rejected' | 'completed';

interface Grant {
  id: number;
  applicant: string;
  projectName: string;
  description: string;
  requestedAmount: number;
  votesFor: number;
  votesAgainst: number;
  status: GrantStatus;
  depositRequired: number;
  createdAt: string;
  endsIn?: string;
}

interface Staker {
  address: string;
  amount: number;
  rank: number;
}

const App = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'grants' | 'apply' | 'stake'>('dashboard');
  
  // Mock data
  const treasuryBalance = 125000;
  const availableForGrants = treasuryBalance * 0.5;
  const totalStaked = 850000;
  const userBalance = 5000;
  const userStaked = 2500;
  const taxRate = { buy: 5, sell: 5 };

  const [grants, setGrants] = useState<Grant[]>([
    {
      id: 1,
      applicant: '0x742d...3f8a',
      projectName: 'DeFi Aggregator Protocol',
      description: 'Building a cross-chain DeFi aggregator to optimize yields across multiple protocols with advanced routing algorithms',
      requestedAmount: 15000,
      votesFor: 125000,
      votesAgainst: 45000,
      status: 'voting',
      depositRequired: 1050,
      createdAt: '2024-11-01',
      endsIn: '4d 12h'
    },
    {
      id: 2,
      applicant: '0x8f3c...92b1',
      projectName: 'NFT Marketplace v2',
      description: 'Community-driven NFT marketplace with zero platform fees and advanced trading features',
      requestedAmount: 25000,
      votesFor: 89000,
      votesAgainst: 156000,
      status: 'voting',
      depositRequired: 1750,
      createdAt: '2024-10-28',
      endsIn: '2d 8h'
    },
    {
      id: 3,
      applicant: '0x1a2b...4c5d',
      projectName: 'Web3 Education Platform',
      description: 'Comprehensive Web3 education platform with on-chain credentials and verifiable achievements',
      requestedAmount: 10000,
      votesFor: 0,
      votesAgainst: 0,
      status: 'pending',
      depositRequired: 700,
      createdAt: '2024-11-05'
    }
  ]);

  const topStakers: Staker[] = [
    { address: '0x1a2b...4c5d', amount: 45000, rank: 1 },
    { address: '0x9f8e...7d6c', amount: 38000, rank: 2 },
    { address: '0x3b4a...2c1d', amount: 32000, rank: 3 },
    { address: '0x7e6f...5a4b', amount: 28000, rank: 4 },
    { address: '0x2c3d...8e9f', amount: 25000, rank: 5 }
  ];

  const handleVote = (grantId: number, support: boolean, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid vote amount');
      return;
    }

    const voteAmount = parseFloat(amount);
    if (voteAmount > userBalance) {
      alert('Insufficient balance');
      return;
    }

    setGrants(grants.map(grant => {
      if (grant.id === grantId) {
        return {
          ...grant,
          votesFor: support ? grant.votesFor + voteAmount : grant.votesFor,
          votesAgainst: !support ? grant.votesAgainst + voteAmount : grant.votesAgainst
        };
      }
      return grant;
    }));

    alert(`Voted with ${voteAmount} tokens (burned)`);
  };

  const GrantCard = ({ grant }: { grant: Grant }) => {
    const totalVotes = grant.votesFor + grant.votesAgainst;
    const forPercentage = totalVotes > 0 ? (grant.votesFor / totalVotes) * 100 : 0;
    const [voteAmount, setVoteAmount] = useState('');
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [voteType, setVoteType] = useState<'for' | 'against'>('for');

    return (
      <>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{grant.projectName}</h3>
                <p className="text-sm text-gray-500 font-mono">{grant.applicant}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  grant.status === 'voting' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                  grant.status === 'approved' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                  grant.status === 'rejected' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                  grant.status === 'completed' ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' :
                  'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                }`}>
                  {grant.status}
                </span>
                {grant.endsIn && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ends in {grant.endsIn}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{grant.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                <div className="text-xs font-semibold text-purple-600 mb-1">Requested</div>
                <div className="text-2xl font-bold text-gray-900">${grant.requestedAmount.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                <div className="text-xs font-semibold text-orange-600 mb-1">Deposit (7%)</div>
                <div className="text-2xl font-bold text-gray-900">{grant.depositRequired.toLocaleString()}</div>
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
                        {grant.votesFor.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {grant.votesAgainst.toLocaleString()} votes
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
                  <button
                    onClick={() => { setVoteType('for'); setShowVoteModal(true); }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Vote For
                  </button>
                  <button
                    onClick={() => { setVoteType('against'); setShowVoteModal(true); }}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Vote Against
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Vote Modal */}
        {showVoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vote {voteType === 'for' ? 'For' : 'Against'}
              </h3>
              <p className="text-gray-600 mb-6">
                Enter the amount of tokens you want to vote with. These tokens will be burned.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vote Amount
                </label>
                <input
                  type="number"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Available: {userBalance.toLocaleString()} tokens
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
                  onClick={() => { setShowVoteModal(false); setVoteAmount(''); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleVote(grant.id, voteType === 'for', voteAmount);
                    setShowVoteModal(false);
                    setVoteAmount('');
                  }}
                  className={`flex-1 py-3 text-white rounded-xl font-bold hover:shadow-lg transition-all ${
                    voteType === 'for' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                >
                  Confirm Vote
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  GrantDAO
                </h1>
                <p className="text-xs text-gray-500 font-medium">Community Governed Grants</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium">Your Balance</div>
                  <div className="text-lg font-bold text-gray-900">{userBalance.toLocaleString()}</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium">Staked</div>
                  <div className="text-lg font-bold text-purple-600">{userStaked.toLocaleString()}</div>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'grants', label: 'Grants', icon: Award },
              { id: 'apply', label: 'Apply', icon: ExternalLink },
              { id: 'stake', label: 'Stake', icon: Lock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "dashboard" | "grants" | "apply" | "stake")}
                className={`px-6 py-4 font-bold transition-all flex items-center gap-2 relative ${
                  activeTab === tab.id
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Coins className="w-10 h-10 opacity-80" />
                  <div className="text-right">
                    <div className="text-sm opacity-90 font-medium">Treasury Balance</div>
                    <div className="text-3xl font-bold">${treasuryBalance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs opacity-75">5% buy / 5% sell tax → Treasury</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-green-600" />
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Available Grants</div>
                    <div className="text-3xl font-bold text-gray-900">${availableForGrants.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">50% of treasury pool</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-purple-600" />
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Total Staked</div>
                    <div className="text-3xl font-bold text-gray-900">{(totalStaked / 1000).toFixed(0)}K</div>
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                        staker.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
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
                      <div className="text-xl font-bold text-gray-900">{staker.amount.toLocaleString()}</div>
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
                <p className="text-gray-600">Vote on proposals using your tokens (tokens will be burned)</p>
              </div>
              <button
                onClick={() => setActiveTab('apply')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Submit Application
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {grants.map(grant => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Grant</h2>
              <p className="text-gray-600 mb-8">Submit your project for community consideration</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="Enter your project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Project Description
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none"
                    placeholder="Describe your project, goals, and how the grant will be used..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Requested Amount (USD)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum available: ${availableForGrants.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Grant Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                      Application requires token burn to submit
                    </li>
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

                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-lg">
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stake' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Stake Your Tokens</h2>
              <p className="text-gray-600 mb-8">Become a top staker and earn airdrop rewards</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-purple-100">
                  <div className="text-sm font-semibold text-purple-600 mb-1">Available Balance</div>
                  <div className="text-4xl font-bold text-gray-900">{userBalance.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">tokens</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-2xl text-white">
                  <div className="text-sm font-semibold opacity-90 mb-1">Currently Staked</div>
                  <div className="text-4xl font-bold">{userStaked.toLocaleString()}</div>
                  <div className="text-xs opacity-75 mt-1">tokens locked</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Amount to Stake
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl font-bold transition-all"
                  />
                  <div className="flex gap-2 mt-3">
                    {[25, 50, 75, 100].map(pct => (
                      <button
                        key={pct}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg font-bold text-gray-700 transition-all"
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

                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-lg flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Stake Tokens
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;