import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, TrendingUp, Zap, Eye, Droplets, Users, Building2, Star, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto flex items-center min-h-screen">
          <div className="w-full text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Star className="h-4 w-4 mr-2 fill-current" />
              India's First Tokenized Real Estate Platform
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Own Prime
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient delay-100">
                Real Estate,
              </span>
              <span className="block text-2xl md:text-4xl lg:text-5xl mt-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-semibold">
                One Token at a Time
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Fractional property investing made 
              <span className="text-blue-400 font-semibold"> instant</span>,
              <span className="text-purple-400 font-semibold"> transparent</span>, and
              <span className="text-green-400 font-semibold"> affordable</span>.
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400">₹10,000</div>
                <div className="text-gray-400 text-sm">Min Investment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400">8.4%</div>
                <div className="text-gray-400 text-sm">Avg Returns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400">24/7</div>
                <div className="text-gray-400 text-sm">Trading</div>
              </div>
            </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/signup" className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="ml-3 h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#marketplace" className="group border-2 border-gray-600 hover:border-blue-500/50 bg-gray-900/50 hover:bg-blue-900/20 px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 backdrop-blur-sm">
                <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300">
                  Explore Marketplace
                </span>
              </a>
            </div>{/* Enhanced Trust Bar */}
            <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-300">
                <div className="flex items-center group">
                  <div className="p-2 bg-green-500/10 rounded-full mr-3 group-hover:bg-green-500/20 transition-colors">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-medium">Blockchain Secured</span>
                </div>
                <div className="flex items-center group">
                  <div className="p-2 bg-blue-500/10 rounded-full mr-3 group-hover:bg-blue-500/20 transition-colors">
                    <Eye className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="font-medium">Fully Transparent</span>
                </div>
                <div className="flex items-center group">
                  <div className="p-2 bg-purple-500/10 rounded-full mr-3 group-hover:bg-purple-500/20 transition-colors">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="font-medium">Decentralized</span>
                </div>
                
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <TrendingUp className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Diversify Instantly</h3>
              <p className="text-gray-300">
                Spread your capital across multiple high‑yield properties from ₹10,000 per token.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <Eye className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Full Transparency</h3>
              <p className="text-gray-300">
                Real‑time token supply, valuations, and rental returns—no spreadsheets, no guesswork.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
              <Droplets className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Easy Liquidity</h3>
              <p className="text-gray-300">
                Sell tokens back to the platform or to other investors with two clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Fractional */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Fractional?</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Skip the ₹25 L down payment. Start with what fits your wallet and still enjoy the rental income and capital appreciation of premium real estate.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">₹10,000</div>
                  <div className="text-gray-400">Minimum Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">8.4%</div>
                  <div className="text-gray-400">Average Yield</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">2 Clicks</div>
                  <div className="text-gray-400">To Buy/Sell</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">24/7</div>
                  <div className="text-gray-400">Market Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-4">Create an Account</h3>
              <p className="text-gray-300">Sign up with your email—takes 30 seconds.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-4">Verify Your Identity</h3>
              <p className="text-gray-300">Quick KYC ensures compliance & security.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-4">Choose a Property SPV</h3>
              <p className="text-gray-300">Browse curated assets, view tokenomics, and projected yields.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">4</div>
              <h3 className="text-xl font-bold mb-4">Buy & Track</h3>
              <p className="text-gray-300">Tokens appear in your EstateWallet instantly—watch rent flow and value grow.</p>
            </div>
          </div>
        </div>
      </section>      {/* Featured SPVs */}
      <section id="marketplace" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Building2 className="h-4 w-4 mr-2" />
              Premium Investment Opportunities
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured SPVs
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Invest in carefully curated Special Purpose Vehicles backed by premium real estate across India's top cities
            </p>
          </div>

          {/* SPV Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Mumbai Prime SPV */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Property Image/Gradient */}
              <div className="relative h-64 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-medium backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white">
                    <div className="text-sm opacity-80">Mumbai, Maharashtra</div>
                    <div className="text-lg font-bold">Powai Lake District</div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    Mumbai Prime SPV
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">SPV Code</div>
                    <div className="text-sm font-mono text-blue-400">MP2025</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-green-400 mb-1">8.4%</div>
                    <div className="text-sm text-gray-400">Expected Yield</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-blue-400 mb-1">₹10,000</div>
                    <div className="text-sm text-gray-400">Per Token</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm mb-6">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>247 Investors</span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span className="font-medium">Premium Location</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-blue-400 font-medium">78% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4 shadow-lg shadow-blue-500/20"></div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  <span>Invest Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bangalore Tech SPV */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl overflow-hidden hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-64 bg-gradient-to-br from-green-500 via-emerald-600 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-xs font-medium backdrop-blur-sm">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                    Hot
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white">
                    <div className="text-sm opacity-80">Bangalore, Karnataka</div>
                    <div className="text-lg font-bold">Indiranagar Tech Hub</div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                    Bangalore Tech SPV
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">SPV Code</div>
                    <div className="text-sm font-mono text-green-400">BT2025</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-green-400 mb-1">9.1%</div>
                    <div className="text-sm text-gray-400">Expected Yield</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-blue-400 mb-1">₹10,500</div>
                    <div className="text-sm text-gray-400">Per Token</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-6">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>312 Investors</span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span className="font-medium">High Growth Area</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-green-400 font-medium">92% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-11/12 shadow-lg shadow-green-500/20"></div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  <span>Invest Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Gurgaon Corporate SPV */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative h-64 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium backdrop-blur-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    Stable
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white">
                    <div className="text-sm opacity-80">Gurgaon, Haryana</div>
                    <div className="text-lg font-bold">DLF Cyber City</div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    Gurgaon Corporate SPV
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">SPV Code</div>
                    <div className="text-sm font-mono text-purple-400">GC2025</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-green-400 mb-1">7.8%</div>
                    <div className="text-sm text-gray-400">Expected Yield</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-3xl font-bold text-blue-400 mb-1">₹20,000</div>
                    <div className="text-sm text-gray-400">Per Token</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-6">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>189 Investors</span>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span className="font-medium">Corporate Hub</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-purple-400 font-medium">65% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-2/3 shadow-lg shadow-purple-500/20"></div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  <span>Invest Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button className="group relative bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 hover:border-blue-500/50 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 text-lg">
                View All Investment Opportunities
              </span>
              <ArrowRight className="inline-block ml-3 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Investor Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 text-gray-300">
                "Finally a way to own real estate without huge loans. I'm getting steady rent every month."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-4">
                  <div className="font-bold">Rohan S.</div>
                  <div className="text-gray-400">Pune</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 text-gray-300">
                "Liquid in, liquid out. Sold part of my stake in 48 hours when I needed cash."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-bold">Ananya K.</div>
                  <div className="text-gray-400">Bengaluru</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Security & Compliance</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 text-gray-300">
            <div className="flex items-center">
              <Lock className="h-6 w-6 mr-3 text-green-500" />
              Bank‑grade encryption
            </div>
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-3 text-green-500" />
              SEBI sandbox pilot
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
              Funds held in escrow until settlement
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to own a piece of India's fastest‑growing cities?
          </h2>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105">
              Create Your Free Account
            </Link>
            <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">EstateWallet</span>
            </div>
            <div className="flex flex-wrap gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Risk Disclosure</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="mb-2">© 2025 EstateWallet Technologies</p>
            <p className="text-sm">
              "Tokenised real‑estate products carry market risks. Read the offer document carefully."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;