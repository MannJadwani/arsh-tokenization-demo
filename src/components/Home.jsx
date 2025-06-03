import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userAuth = localStorage.getItem('userAuth');
    
    if (isLoggedIn && userAuth) {
      setUser(JSON.parse(userAuth));
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user.firstName}!</span>
          </h1>
          <p className="text-gray-400">Manage your real estate investments and track your portfolio performance.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">₹2,45,000</div>
            <div className="text-sm text-gray-400">Total Portfolio Value</div>
            <div className="text-xs text-green-400 mt-2">+12.5% this month</div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">₹18,500</div>
            <div className="text-sm text-gray-400">Monthly Returns</div>
            <div className="text-xs text-green-400 mt-2">+8.2% from last month</div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">7</div>
            <div className="text-sm text-gray-400">Active SPV Investments</div>
            <div className="text-xs text-blue-400 mt-2">2 new this month</div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <PieChart className="h-6 w-6 text-yellow-400" />
              </div>
              <ArrowDownRight className="h-5 w-5 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">8.4%</div>
            <div className="text-sm text-gray-400">Average Yield</div>
            <div className="text-xs text-red-400 mt-2">-0.3% from last month</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-6">Your SPV Investments</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Mumbai Prime SPV</div>
                      <div className="text-sm text-gray-400">245 tokens • ₹2,45,000</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">+12.5%</div>
                    <div className="text-sm text-gray-400">₹8,500/month</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Bangalore Tech SPV</div>
                      <div className="text-sm text-gray-400">156 tokens • ₹1,64,400</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">+15.2%</div>
                    <div className="text-sm text-gray-400">₹7,200/month</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Gurgaon Corporate SPV</div>
                      <div className="text-sm text-gray-400">89 tokens • ₹1,78,000</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">+9.8%</div>
                    <div className="text-sm text-gray-400">₹5,800/month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-gray-700/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Rental payment received</div>
                    <div className="text-xs text-gray-400">Mumbai Prime SPV • ₹8,500</div>
                  </div>
                  <div className="text-xs text-gray-400">2 hours ago</div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-700/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New tokens purchased</div>
                    <div className="text-xs text-gray-400">Bangalore Tech SPV • 25 tokens</div>
                  </div>
                  <div className="text-xs text-gray-400">1 day ago</div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-700/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Property valuation updated</div>
                    <div className="text-xs text-gray-400">Gurgaon Corporate SPV • +2.5%</div>
                  </div>
                  <div className="text-xs text-gray-400">3 days ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all">
                  Browse New SPVs
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all">
                  Add Funds
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all">
                  Withdraw Earnings
                </button>
              </div>
            </div>

            {/* Market Updates */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Market Updates</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">New SPV Launch</div>
                  <div className="text-xs text-gray-400">Delhi Metro SPV launching next week with 9.2% expected yield</div>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">Rate Update</div>
                  <div className="text-xs text-gray-400">RBI repo rate unchanged, positive for real estate sector</div>
                </div>
              </div>
            </div>

            {/* Portfolio Allocation */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Portfolio Allocation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Mumbai</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-2/5"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Bangalore</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Gurgaon</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
