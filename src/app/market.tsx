"use client"
import React, { useState, useEffect } from 'react';
import { Wallet, Code, Shield, TrendingUp, Search, Filter, Plus, User, LogOut, CheckCircle, Github, Twitter, Globe, DollarSign, Users, Star, Activity } from 'lucide-react';

// Types
interface Agent {
    id: string;
    name: string;
    description: string;
    price: string;
    seller: string;
    sellerName: string;
    verified: boolean;
    category: string;
    blockchain: string;
    deploymentDate: string;
    revenue: string;
    users: number;
    rating: number;
    image: string;
    githubProof?: string;
    contractAddress?: string;
    features: string[];
}

interface User {
    address: string;
    name: string;
    bio: string;
    twitter?: string;
    github?: string;
    website?: string;
}

// Mock data
const mockAgents: Agent[] = [
    {
        id: '1',
        name: 'TradingBot Alpha',
        description: 'Advanced AI trading bot with ML-powered market analysis and automated execution on Base chain',
        price: '5.5',
        seller: '0x742d...4b3c',
        sellerName: 'CryptoBuilder',
        verified: true,
        category: 'Trading',
        blockchain: 'Base',
        deploymentDate: '2024-10-15',
        revenue: '12.5K',
        users: 450,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        githubProof: 'github.com/proof',
        contractAddress: '0x1234...5678',
        features: ['Real-time analysis', 'Auto-trading', 'Risk management', 'Multi-DEX support']
    },
    {
        id: '2',
        name: 'SocialFi Manager',
        description: 'Complete SocialFi agent with content generation, engagement tracking, and community management',
        price: '3.2',
        seller: '0x8a3f...9d2e',
        sellerName: 'SocialDev',
        verified: true,
        category: 'Social',
        blockchain: 'Base',
        deploymentDate: '2024-10-20',
        revenue: '8.3K',
        users: 320,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
        features: ['Content AI', 'Analytics', 'Auto-responses', 'Growth tools']
    },
    {
        id: '3',
        name: 'NFT Minting Bot',
        description: 'Automated NFT collection management with AI art generation and smart pricing algorithms',
        price: '4.8',
        seller: '0x5c7b...2a1f',
        sellerName: 'NFTCreator',
        verified: false,
        category: 'NFT',
        blockchain: 'Base',
        deploymentDate: '2024-10-25',
        revenue: '15.7K',
        users: 580,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=300&fit=crop',
        features: ['AI art generation', 'Smart pricing', 'Rarity system', 'Batch minting']
    }
];

const categories = ['All', 'Trading', 'Social', 'NFT', 'DeFi', 'Gaming', 'Utility'];

export default function AIAgentMarketplace() {
    const [page, setPage] = useState<'landing' | 'marketplace' | 'list' | 'profile'>('landing');
    const [wallet, setWallet] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [agents, setAgents] = useState<Agent[]>(mockAgents);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // New listing form state
    const [newListing, setNewListing] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Trading',
        contractAddress: '',
        githubProof: '',
        features: ['', '', '', '']
    });

    const connectWallet = () => {
        // Simulate wallet connection
        const mockAddress = '0x' + Math.random().toString(16).slice(2, 5) + '...' + Math.random().toString(16).slice(2, 6);
        setWallet(mockAddress);
        setUserProfile({
            address: mockAddress,
            name: 'Anon',
            bio: 'AI Agent developer and trader',
            twitter: '',
            github: '',
            website: ''
        });
    };

    const disconnectWallet = () => {
        setWallet(null);
        setUserProfile(null);
        setPage('landing');
    };

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleListingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet) return;

        const newAgent: Agent = {
            id: String(agents.length + 1),
            name: newListing.name,
            description: newListing.description,
            price: newListing.price,
            seller: wallet,
            sellerName: userProfile?.name || 'Anonymous',
            verified: false,
            category: newListing.category,
            blockchain: 'Base',
            deploymentDate: new Date().toISOString().split('T')[0],
            revenue: '0',
            users: 0,
            rating: 0,
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
            githubProof: newListing.githubProof,
            contractAddress: newListing.contractAddress,
            features: newListing.features.filter(f => f.trim() !== '')
        };

        setAgents([...agents, newAgent]);
        setPage('marketplace');
        // Reset form
        setNewListing({
            name: '',
            description: '',
            price: '',
            category: 'Trading',
            contractAddress: '',
            githubProof: '',
            features: ['', '', '', '']
        });
    };

    // Landing Page
    if (page === 'landing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="w-8 h-8 text-purple-400" />
                            <span className="lg:text-2xl font-extrabold text-white">AgentMarket</span>
                        </div>
                        <button
                            onClick={() => {
                                if (wallet) {
                                    setPage('marketplace');
                                } else {
                                    connectWallet();
                                    setPage('marketplace');
                                }
                            }}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
                        >
                            LAUNCH APP
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="pt-32 pb-20 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="lg:text-6xl text-2xl font-bold text-white mb-6 leading-tight">
                            Buy & Sell Proven
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AI Agent Source Code
                            </span>
                        </h1>
                        <p className="text-sm lg:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                            An open marketplace for listing and discovering AI agents. We make it possible for developers to list, sell, and acquire battle-tested AI agent codebases, so you don’t have to build from scratch.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    if (wallet) {
                                        setPage('marketplace');
                                    } else {
                                        connectWallet();
                                        setPage('marketplace');
                                    }
                                }}
                                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-xl font-semibold hover:scale-105 transition-transform shadow-xl shadow-purple-500/50"
                            >
                                Explore Marketplace
                            </button>
                            <button
                                onClick={() => {
                                    if (wallet) {
                                        setPage('list');
                                    } else {
                                        connectWallet();
                                        setPage('list');
                                    }
                                }}
                                className="cursor-pointer px-4 py-2 bg-slate-800 text-white text-sm rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-purple-500/30"
                            >
                                List Your Agent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                            <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Verified Ownership</h3>
                            <p className="text-gray-400">
                                Smart contract verification ensures sellers truly own the AI agents they are listing. GitHub integration for additional proof.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                            <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Performance Metrics</h3>
                            <p className="text-gray-400">
                                See real revenue, user counts, and ratings before buying. Make informed decisions with transparent data.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                            <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                                <Code className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Complete Source Code</h3>
                            <p className="text-gray-400">
                                Get full access to tested, production-ready code. Deploy immediately or customize to your needs.
                            </p>
                        </div>
                    </div>
                </div>



                {/* How It Works */}
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">1</div>
                            <h3 className="text-xl font-bold text-white mb-3">Connect Wallet</h3>
                            <p className="text-gray-400">Connect your Web3 wallet to access the marketplace</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">2</div>
                            <h3 className="text-xl font-bold text-white mb-3">Browse or List</h3>
                            <p className="text-gray-400">Explore agents or list your own with verified ownership</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">3</div>
                            <h3 className="text-xl font-bold text-white mb-3">Trade Securely</h3>
                            <p className="text-gray-400">Complete transactions with smart contract escrow</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-purple-500/20 mt-20">
                    <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
                        <p>© 2025 AgentMarket. Built on Base Chain with ❤️</p>
                    </div>
                </footer>
            </div>
        );
    }

    // Marketplace Page
    if (page === 'marketplace') {
        return (
            <div className="min-h-screen bg-slate-900">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('landing')}>
                            <Code className="w-6 h-6 text-purple-400" />
                            <span className="text-xs lg:text-xl font-bold text-white">AgentMarket</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPage('list')}
                                className="px-2 py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-1 text-[12px]"
                            >
                                <Plus className="w-3 h-3" />
                                List
                            </button>
                            {wallet && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPage('profile')}
                                        className="px-2 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1 text-[12px]"
                                    >
                                        <User className="w-3 h-3" />
                                        Profile
                                    </button>
                                    <div className="hidden lg:flex px-4 py-2 bg-slate-800 rounded-lg text-sm text-white flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-purple-400" />
                                        {wallet}
                                    </div>
                                    <button
                                        onClick={disconnectWallet}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {!wallet && (
                                <button
                                    onClick={connectWallet}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search AI agents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-6 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 hover:border-purple-500 transition-colors flex items-center gap-2"
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>
                        </div>

                        {/* Category Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAgents.map(agent => (
                            <div key={agent.id} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500 transition-all overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {agent.verified && (
                                            <div className="px-2 py-1 bg-green-600/90 backdrop-blur rounded-full flex items-center gap-1 text-xs text-white">
                                                <CheckCircle className="w-3 h-3" />
                                                Verified
                                            </div>
                                        )}
                                        <div className="px-2 py-1 bg-purple-600/90 backdrop-blur rounded-full text-xs text-white">
                                            {agent.category}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                                            <p className="text-sm text-gray-400">by {agent.sellerName}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-400">{agent.price} ETH</div>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>

                                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-white font-bold">{agent.revenue}</div>
                                            <div className="text-gray-400 text-xs">Revenue</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white font-bold">{agent.users}</div>
                                            <div className="text-gray-400 text-xs">Users</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white font-bold flex items-center justify-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                {agent.rating}
                                            </div>
                                            <div className="text-gray-400 text-xs">Rating</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {agent.features.slice(0, 3).map((feature, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-transform">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAgents.length === 0 && (
                        <div className="text-center py-20">
                            <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No agents found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List Agent Page
    if (page === 'list') {
        return (
            <div className="min-h-screen bg-slate-900">
                <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('marketplace')}>
                            <Code className="w-6 h-6 text-purple-400" />
                            <span className="text-xs font-bold text-white">AgentMarket</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {wallet && (
                                <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-white flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-purple-400" />
                                    {wallet}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">List Your AI Agent</h1>
                        <p className="text-gray-400">Fill in the details below to list your AI agent on the marketplace</p>
                    </div>

                    <form onSubmit={handleListingSubmit} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newListing.name}
                                    onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                                    placeholder="e.g., TradingBot Pro"
                                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea
                                    required
                                    value={newListing.description}
                                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                    placeholder="Describe what your AI agent does, its key features, and what makes it valuable..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (ETH) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newListing.price}
                                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                                        placeholder="5.5"
                                        className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                    <select
                                        required
                                        value={newListing.category}
                                        onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Contract Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={newListing.contractAddress}
                                    onChange={(e) => setNewListing({ ...newListing, contractAddress: e.target.value })}
                                    placeholder="0x..."
                                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Your deployed agents contract address for verification</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Proof (Optional)</label>
                                <input
                                    type="url"
                                    value={newListing.githubProof}
                                    onChange={(e) => setNewListing({ ...newListing, githubProof: e.target.value })}
                                    placeholder="https://github.com/your-repo/proof"
                                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Link to GitHub repo or gist proving ownership</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Key Features (up to 4)</label>
                                {newListing.features.map((feature, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...newListing.features];
                                            newFeatures[idx] = e.target.value;
                                            setNewListing({ ...newListing, features: newFeatures });
                                        }}
                                        placeholder={`Feature ${idx + 1}`}
                                        className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none mb-3"
                                    />
                                ))}
                            </div>

                            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Ownership Verification</h4>
                                        <p className="text-xs text-gray-400">
                                            We will verify your contract address ownership via wallet signature. GitHub proof is optional but increases buyer confidence.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setPage('marketplace')}
                                    className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-transform"
                                >
                                    List Agent
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Profile Page
    if (page === 'profile') {
        const userAgents = agents.filter(a => a.seller === wallet);

        return (
            <div className="min-h-screen bg-slate-900">
                 <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('landing')}>
                            <Code className="w-6 h-6 text-purple-400" />
                            <span className="text-xs lg:text-xl font-bold text-white">AgentMarket</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPage('list')}
                                className="px-2 py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-1 text-[12px]"
                            >
                                <Plus className="w-3 h-3" />
                                List
                            </button>
                            {wallet && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPage('profile')}
                                        className="px-2 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1 text-[12px]"
                                    >
                                        <User className="w-3 h-3" />
                                        Profile
                                    </button>
                                    <div className="hidden lg:flex px-4 py-2 bg-slate-800 rounded-lg text-sm text-white flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-purple-400" />
                                        {wallet}
                                    </div>
                                    <button
                                        onClick={disconnectWallet}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {!wallet && (
                                <button
                                    onClick={connectWallet}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>
                </nav>


                <div className="max-w-5xl mx-auto px-6 py-12">
                    {/* Profile Header */}
                    <div className="bg-slate-800 rounded-xl p-2 border border-slate-700 mb-8">
                        <div className="flex space-x-2 justify-between items-center  ">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                {userProfile?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-white">{userProfile?.name}</h2>
                                    <div className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-400">
                                        Seller
                                    </div>
                                </div>
                                
                            </div>
                            <button className="px-2 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-bold cursor-pointer">
                                Edit Profile
                            </button>
                        </div>

                        <p className="text-gray-400 mt-5">{userProfile?.bio}</p>
                                <div className="flex gap-3">
                                    {userProfile?.twitter && (
                                        <a href={`https://twitter.com/${userProfile.twitter}`} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                            <Twitter className="w-4 h-4 text-gray-300" />
                                        </a>
                                    )}
                                    {userProfile?.github && (
                                        <a href={`https://github.com/${userProfile.github}`} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                            <Github className="w-4 h-4 text-gray-300" />
                                        </a>
                                    )}
                                    {userProfile?.website && (
                                        <a href={userProfile.website} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                            <Globe className="w-4 h-4 text-gray-300" />
                                        </a>
                                    )}
                                </div>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Code className="w-5 h-5 text-purple-400" />
                                <span className="text-gray-400 text-sm">Listed Agents</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{userAgents.length}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                <span className="text-gray-400 text-sm">Total Sales</span>
                            </div>
                            <div className="text-2xl font-bold text-white">0 ETH</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-gray-400 text-sm">Avg Rating</span>
                            </div>
                            <div className="text-2xl font-bold text-white">-</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                <span className="text-gray-400 text-sm">Active Since</span>
                            </div>
                            <div className="text-2xl font-bold text-white">Today</div>
                        </div>
                    </div>

                    {/* Listed Agents */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-white">Your Listed Agents</h3>
                            <button
                                onClick={() => setPage('list')}
                                className="px-2 text-sm py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                List New Agent
                            </button>
                        </div>

                        {userAgents.length > 0 ? (
                            <div className="space-y-4">
                                {userAgents.map(agent => (
                                    <div key={agent.id} className="bg-slate-800 rounded-lg border border-slate-700 p-2 hover:border-purple-500 transition-colors">
                                        <div className="flex gap-6">
                                            <img src={agent.image} alt={agent.name} className="w-32 h-32 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-white mb-1">{agent.name}</h4>
                                                        <p className="text-gray-400 text-sm">{agent.category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-purple-400 mb-1">{agent.price} ETH</div>
                                                        {agent.verified ? (
                                                            <div className="text-xs text-green-400 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Verified
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-yellow-400">Pending Verification</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
                                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        {agent.users} users
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        {agent.revenue} revenue
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4" />
                                                        {agent.rating > 0 ? agent.rating : 'No ratings yet'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                                            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                                                Edit Listing
                                            </button>
                                            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                                                View Analytics
                                            </button>
                                            <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm ml-auto">
                                                Remove Listing
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 text-center">
                                <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-white mb-2">No agents listed yet</h4>
                                <p className="text-gray-400 mb-6">Start by listing your first AI agent on the marketplace</p>
                                <button
                                    onClick={() => setPage('list')}
                                    className="px-2 py-1 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-transform inline-flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    List Your First Agent
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}