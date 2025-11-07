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
  const [maxVotes, setMaxVotes] = useState<number>(20000000)
  const [socials, setSocials] = useState({
    twitter: "",
    telegram: "",
    website: "",
    farcaster: ""
  });

  // Mock data
  const treasuryBalance = 100000;
  const availableForGrants = treasuryBalance * 0.5;
  const totalStaked = 850000;
  const userBalance = 5000;
  const userStaked = 2500;
  const taxRate = { buy: 3, sell: 3 };

  const [grants, setGrants] = useState<Grant[]>([
    {
      id: 1,
      applicant: '0x742d...3f8a',
      projectName: 'DeFi Aggregator Protocol',
      description: 'Building a cross-chain DeFi aggregator to optimize yields across multiple protocols with advanced routing algorithms',
      requestedAmount: 15000,
      votesFor: 12005000,
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
      status: 'completed',
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
      status: 'pending',
      depositRequired: 700,
      createdAt: '2024-11-05'
    },
    {
      id: 4,
      applicant: '0x1a2b...4c5d',
      projectName: 'Game Dao',
      description: 'Comprehensive Web3 education platform with on-chain credentials and verifiable achievements',
      requestedAmount: 10000,
      votesFor: 1000,
      status: 'approved',
      depositRequired: 70000,
      createdAt: '2024-11-05'
    },
    {
      id: 4,
      applicant: '0x1a2b...4c5d',
      projectName: 'Game Dao',
      description: 'Comprehensive Web3 education platform with on-chain credentials and verifiable achievements',
      requestedAmount: 2000,
      votesFor: 1000,
      status: 'rejected',
      depositRequired: 70000,
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
        };
      }
      return grant;
    }));

    alert(`Voted with ${voteAmount} tokens (burned)`);
  };

  const GrantCard = ({ grant }: { grant: Grant }) => {
    const totalVotes = grant.votesFor;
    const forPercentage = totalVotes > 0 ? (grant.votesFor / maxVotes) * 100 : 0;
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${grant.status === 'voting' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
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
                        {grant.votesFor.toLocaleString()} grant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {maxVotes.toLocaleString()} grant
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
                    className="flex-1 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Vote
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
                  Vote Amount (Max 2M)
                </label>
                <input
                  type="number"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
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
                  className="flex-1 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleVote(grant.id, voteType === 'for', voteAmount);
                    setShowVoteModal(false);
                    setVoteAmount('');
                  }}
                  className={`flex-1 cursor-pointer py-2 text-white rounded-xl font-bold hover:shadow-lg transition-all ${voteType === 'for'
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                >
                  Confirm Votes
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const checklistItems: string[] = [
    "I confirm that all information provided is accurate.",
    "I understand that false details may lead to disqualification.",
    "I agree to the platform’s Privacy Policy.",

  ];

  const ChecklistAgreement: React.FC = () => {
    const [checked, setChecked] = useState<boolean[]>(
      checklistItems.map(() => false)
    );

    const toggleCheck = (index: number): void => {
      setChecked((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    };

    const allChecked: boolean = checked.every(Boolean);

    return (
      <div className=" text-gray-600 space-y-1 text-xs">

        {checklistItems.map((item, i) => (
          <label key={i} className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => toggleCheck(i)}
              className="mt-1"
            />
            <span>{item}</span>
          </label>
        ))}

        {/* <button
          disabled={!allChecked}
          onClick={onContinue}
          className={`w-full py-2 rounded-lg mt-4 ${allChecked ? "bg-green-600" : "bg-gray-500 cursor-not-allowed"
            }`}
        >
          Continue
        </button> */}
      </div>
    );
  };

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
                  Grant
                </h1>
                <p className="text-xs text-gray-500 font-bold">Community Governed Grants</p>
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
              <button className="px-6 py-2.5 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
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
                    <div className="text-3xl font-bold">${treasuryBalance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs opacity-75">3% buy / 3% sell tax → Treasury</div>
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
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Grant</h2>
              <p className="text-gray-600 mb-8">Submit your project for community consideration</p>

              <form>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="Enter your project name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Token CA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="Enter your token contract address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Purpose of Grant <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="What will the grant be used for..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Requested Amount (USD)  <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                      placeholder="0"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum available: $10,000
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
                          Twitter / X  <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="x.com/username"
                          value={socials.twitter}
                          onChange={(e) =>
                            setSocials({ ...socials, twitter: e.target.value })
                          }
                          required
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>

                      {/* Telegram */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Telegram  <span className="text-red-500">*</span></label>
                        <input
                          type="url"
                          placeholder="t.me/username"
                          value={socials.telegram}
                          required
                          onChange={(e) =>
                            setSocials({ ...socials, telegram: e.target.value })
                          }
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Website</label>
                        <input
                          type="url"
                          placeholder="example.com"
                          value={socials.website}
                          onChange={(e) =>
                            setSocials({ ...socials, website: e.target.value })
                          }
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Farcaster</label>
                        <input
                          type="url"
                          placeholder="@farcaster"
                          value={socials.farcaster}
                          onChange={(e) =>
                            setSocials({ ...socials, farcaster: e.target.value })
                          }
                          className="w-full bg-transparent border border-[#2c2f36] focus:border-[#0AFF5E] outline-none rounded-xl px-4 py-2 placeholder-gray-500 text-sm"
                        />
                      </div>


                    </div>
                  </div>
                  <ChecklistAgreement />


                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Grant Requirements
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {/* <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                        Application requires token burn to submit
                      </li> */}
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


                  <button className="w-full py-4 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm">
                    Submit Application
                  </button>
                </div>
              </form>
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
                    className="w-full px-3 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl font-bold transition-all"
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

                <button className="w-full py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-lg flex items-center justify-center gap-2">
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