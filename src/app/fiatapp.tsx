import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Wallet, DollarSign, ArrowUpRight, ArrowDownRight, LogOut } from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  fiatBalance: number;
}

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  supply: number;
}

interface UserToken {
  tokenId: string;
  amount: number;
}

// Mock data
const mockTokens: Token[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 45000, change24h: 2.5, marketCap: 850000000000, supply: 19000000 },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: -1.2, marketCap: 380000000000, supply: 120000000 },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 105, change24h: 5.8, marketCap: 45000000000, supply: 430000000 },
  { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.65, change24h: 3.2, marketCap: 23000000000, supply: 35000000000 },
  { id: '5', name: 'Polkadot', symbol: 'DOT', price: 8.5, change24h: -0.8, marketCap: 12000000000, supply: 1400000000 },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'signin' | 'signup' | 'tokens' | 'portfolio' | 'trade'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Auth handlers
  const handleSignIn = (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      fiatBalance: 10000
    };
    setUser(mockUser);
    setUserTokens([
      { tokenId: '1', amount: 0.5 },
      { tokenId: '2', amount: 2.3 }
    ]);
    setCurrentPage('tokens');
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      email,
      name,
      fiatBalance: 0
    };
    setUser(mockUser);
    setUserTokens([]);
    setCurrentPage('tokens');
  };

  const handleLogout = () => {
    setUser(null);
    setUserTokens([]);
    setCurrentPage('landing');
  };

  const handleTrade = (tokenId: string, amount: number, type: 'buy' | 'sell') => {
    const token = mockTokens.find(t => t.id === tokenId);
    if (!token || !user) return;

    const totalCost = amount * token.price;

    if (type === 'buy') {
      if (user.fiatBalance >= totalCost) {
        setUser({ ...user, fiatBalance: user.fiatBalance - totalCost });
        const existingToken = userTokens.find(ut => ut.tokenId === tokenId);
        if (existingToken) {
          setUserTokens(userTokens.map(ut => 
            ut.tokenId === tokenId ? { ...ut, amount: ut.amount + amount } : ut
          ));
        } else {
          setUserTokens([...userTokens, { tokenId, amount }]);
        }
      }
    } else {
      const existingToken = userTokens.find(ut => ut.tokenId === tokenId);
      if (existingToken && existingToken.amount >= amount) {
        setUser({ ...user, fiatBalance: user.fiatBalance + totalCost });
        setUserTokens(userTokens.map(ut => 
          ut.tokenId === tokenId ? { ...ut, amount: ut.amount - amount } : ut
        ).filter(ut => ut.amount > 0));
      }
    }
  };

  const handleDeposit = (amount: number) => {
    if (user) {
      setUser({ ...user, fiatBalance: user.fiatBalance + amount });
    }
  };

  // Navigation component
  const Navigation = () => (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LaunchPad
          </h1>
          {user && (
            <div className="flex space-x-4">
              <button onClick={() => setCurrentPage('tokens')} className={`px-3 py-2 rounded-lg ${currentPage === 'tokens' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                Tokens
              </button>
              <button onClick={() => setCurrentPage('portfolio')} className={`px-3 py-2 rounded-lg ${currentPage === 'portfolio' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                Portfolio
              </button>
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">${user.fiatBalance.toFixed(2)}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trade Crypto with Fiat
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            The simplest way to buy and sell tokens using your local currency
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => setCurrentPage('signup')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentPage('signin')} className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all border-2 border-gray-200">
              Sign In
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Deposits</h3>
            <p className="text-gray-600">Deposit fiat currency directly using PayPal gateway</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Trading</h3>
            <p className="text-gray-600">Buy and sell tokens instantly at current market prices</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fiat Withdrawals</h3>
            <p className="text-gray-600">Convert your profits back to fiat anytime</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Sign In Page
  const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button onClick={() => handleSignIn(email, password)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Sign In
            </button>
          </div>
          <p className="text-center mt-6 text-gray-600">
            Dont have an account?{' '}
            <button onClick={() => setCurrentPage('signup')} className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Sign Up Page
  const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">Create Account</h2>
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <button onClick={() => handleSignUp(name, email, password)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Sign Up
            </button>
          </div>
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('signin')} className="text-purple-600 font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Tokens Page
  const TokensPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8">Available Tokens</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">24h Change</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Market Cap</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTokens.map((token) => (
                <tr key={token.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-sm text-gray-500">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">${token.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`flex items-center justify-end space-x-1 ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {token.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span className="font-semibold">{Math.abs(token.change24h)}%</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">${(token.marketCap / 1000000000).toFixed(2)}B</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedToken(token); setCurrentPage('trade'); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Portfolio Page
  const PortfolioPage = () => {
    const [depositAmount, setDepositAmount] = useState('');

    const portfolioValue = userTokens.reduce((total, ut) => {
      const token = mockTokens.find(t => t.id === ut.tokenId);
      return total + (token ? token.price * ut.amount : 0);
    }, 0);

    const totalValue = portfolioValue + (user?.fiatBalance || 0);

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-3xl font-bold mb-8">Portfolio</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-1">Total Value</div>
              <div className="text-3xl font-bold text-gray-800">${totalValue.toFixed(2)}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-1">Fiat Balance</div>
              <div className="text-3xl font-bold text-green-600">${user?.fiatBalance.toFixed(2)}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-1">Token Value</div>
              <div className="text-3xl font-bold text-blue-600">${portfolioValue.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Deposit Fiat (PayPal)</h3>
            <div className="flex space-x-4">
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Amount" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <button onClick={() => { if (depositAmount) { handleDeposit(parseFloat(depositAmount)); setDepositAmount(''); } }} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
                Deposit
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-bold p-6 border-b border-gray-200">Your Tokens</h3>
            {userTokens.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No tokens yet. Start trading!</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Value</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userTokens.map((ut) => {
                    const token = mockTokens.find(t => t.id === ut.tokenId);
                    if (!token) return null;
                    return (
                      <tr key={ut.tokenId} className="border-b border-gray-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold">{token.name}</div>
                              <div className="text-sm text-gray-500">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">{ut.amount.toFixed(4)}</td>
                        <td className="px-6 py-4 text-right">${token.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-semibold">${(token.price * ut.amount).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setSelectedToken(token); setCurrentPage('trade'); }} className="text-blue-600 hover:text-blue-700 font-semibold">
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Trade Page
  const TradePage = () => {
    const [amount, setAmount] = useState('');
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

    if (!selectedToken) return null;

    const totalCost = parseFloat(amount || '0') * selectedToken.price;
    const userToken = userTokens.find(ut => ut.tokenId === selectedToken.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setCurrentPage('tokens')} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2">
            <span>← Back to Tokens</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {selectedToken.symbol.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{selectedToken.name}</h2>
                <p className="text-gray-500">{selectedToken.symbol}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold">${selectedToken.price.toLocaleString()}</div>
                <div className={`flex items-center justify-end space-x-1 ${selectedToken.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedToken.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="font-semibold">{Math.abs(selectedToken.change24h)}%</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <button onClick={() => setTradeType('buy')} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${tradeType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                Buy
              </button>
              <button onClick={() => setTradeType('sell')} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                Sell
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Amount ({selectedToken.symbol})</label>
                <input type="number" step="0.0001" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-bold text-xl">${totalCost.toFixed(2)}</span>
                </div>
                {tradeType === 'buy' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Balance:</span>
                    <span className="font-semibold">${user?.fiatBalance.toFixed(2)}</span>
                  </div>
                )}
                {tradeType === 'sell' && userToken && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your Balance:</span>
                    <span className="font-semibold">{userToken.amount.toFixed(4)} {selectedToken.symbol}</span>
                  </div>
                )}
              </div>

              <button onClick={() => { if (amount) { handleTrade(selectedToken.id, parseFloat(amount), tradeType); setAmount(''); } }} className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedToken.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current page
  return (
    <div>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'signin' && <SignInPage />}
      {currentPage === 'signup' && <SignUpPage />}
      {currentPage === 'tokens' && <TokensPage />}
      {currentPage === 'portfolio' && <PortfolioPage />}
      {currentPage === 'trade' && <TradePage />}
    </div>
  );
};

export default App;