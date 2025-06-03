import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Package, Calendar, ArrowRight } from 'lucide-react';

// Mini trend chart component with static dummy data
const MiniTrendChart = ({ trend = 'up', data = [] }) => {
  const defaultData = trend === 'up' 
    ? [10, 12, 8, 15, 18, 14, 20, 22, 19, 25]
    : [25, 22, 24, 20, 18, 21, 16, 14, 17, 12];
  
  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData);
  const minValue = Math.min(...chartData);
  const range = maxValue - minValue || 1;
  
  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-20 h-8 flex items-center justify-center">
      <svg width="80" height="32" className="overflow-visible">
        <polyline
          fill="none"
          stroke={trend === 'up' ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

// Sell Modal Component
const SellModal = ({ property, holding, isOpen, onClose, onSell }) => {
  const [quantity, setQuantity] = useState('');
  const [askPrice, setAskPrice] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && property) {
      setAskPrice(property.pricePerToken.toString());
    }
  }, [isOpen, property]);
  const validateForm = () => {
    const newErrors = {};
    
    const availableQuantity = holding.quantity - (holding.lockedQuantity || 0);
    
    if (!quantity || quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    } else if (parseFloat(quantity) > availableQuantity) {
      newErrors.quantity = `Maximum ${availableQuantity} tokens available`;
    }
    
    if (!askPrice || askPrice <= 0) {
      newErrors.askPrice = 'Please enter a valid ask price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSell = () => {
    if (!validateForm()) return;
    
    // Get current user from localStorage
    const userAuth = localStorage.getItem('userAuth');
    const currentUser = userAuth ? JSON.parse(userAuth) : null;
    
    if (!currentUser) return;
    
    const sellOrder = {
      id: Date.now().toString(),
      type: 'sell',
      propertyId: property.id,
      propertyName: property.name,
      quantity: parseFloat(quantity),
      price: parseFloat(askPrice),
      totalValue: parseFloat(quantity) * parseFloat(askPrice),
      status: 'pending',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      userId: currentUser.id
    };
    
    onSell(sellOrder);
    setQuantity('');
    setAskPrice('');
    setErrors({});
  };

  if (!isOpen || !property) return null;

  const totalValue = quantity && askPrice ? (parseFloat(quantity) * parseFloat(askPrice)).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Sell Tokens</h2>
            <p className="text-gray-400">{property.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity (Available: {holding.availableQuantity || (holding.quantity - (holding.lockedQuantity || 0))})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={holding.availableQuantity || (holding.quantity - (holding.lockedQuantity || 0))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
            )}
          </div><div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ask Price per Token (₹)
            </label>
            <input
              type="number"
              value={askPrice}
              onChange={(e) => setAskPrice(e.target.value)}
              step="0.01"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ask price"
            />
            {errors.askPrice && (
              <p className="text-red-400 text-sm mt-1">{errors.askPrice}</p>
            )}
          </div>          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Value:</span>
              <span className="text-white font-medium">₹{totalValue}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Place Sell Order
          </button>
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('holdings');
  const [holdings, setHoldings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: Check if user is logged in
    const userAuth = localStorage.getItem('userAuth');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!userAuth || !isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load data from localStorage
    loadWalletData();
  }, [navigate]);
  const loadWalletData = () => {
    // Load holdings - stored as array by PropertyDetail
    const storedHoldings = localStorage.getItem('holdings');
    const holdingsArray = storedHoldings ? JSON.parse(storedHoldings) : [];

    // Load properties
    const storedProperties = localStorage.getItem('properties');
    const propertiesData = storedProperties ? JSON.parse(storedProperties) : [];

    // Load orders
    const storedOrders = localStorage.getItem('orders');
    const ordersData = storedOrders ? JSON.parse(storedOrders) : [];

    // Get current user
    const userAuth = localStorage.getItem('userAuth');
    const currentUser = userAuth ? JSON.parse(userAuth) : null;
    
    if (!currentUser) return;    // Filter holdings for current user and join with properties for display
    const enrichedHoldings = holdingsArray
      .filter(holding => holding.userId === currentUser.id && holding.quantity > 0) // Only show holdings with quantity > 0
      .map(holding => {
        const property = propertiesData.find(p => p.id === holding.propertyId);
        if (!property) return null;

        // Calculate locked and available quantities
        const lockedQuantity = holding.lockedQuantity || 0;
        const availableQuantity = holding.quantity - lockedQuantity;

        // Calculate current NAV (using current property price)
        const currentNAV = holding.quantity * property.pricePerToken;
        const totalCost = holding.totalInvested;
        const gainLoss = currentNAV - totalCost;
        const gainLossPercent = totalCost > 0 ? ((gainLoss / totalCost) * 100) : 0;

        return {
          ...holding,
          property,
          lockedQuantity,
          availableQuantity,
          currentNAV,
          averagePrice: holding.avgPrice,
          gainLoss,
          gainLossPercent,
          trend: gainLossPercent >= 0 ? 'up' : 'down'
        };
      }).filter(Boolean);    setHoldings(enrichedHoldings);
    setProperties(propertiesData);
    
    // Filter orders for current user and separate pending from completed
    const userOrders = ordersData.filter(order => order.userId === currentUser.id);
    const completedOrders = userOrders.filter(order => order.status === 'completed' || order.status === 'done');
    const pendingOrdersList = userOrders.filter(order => order.status === 'pending');
    
    setOrders(completedOrders);
    setPendingOrders(pendingOrdersList);
  };

  const handleSellClick = (property, holding) => {
    setSelectedProperty(property);
    setSelectedHolding(holding);
    setSellModalOpen(true);
  };  const handleSell = (sellOrder) => {
    // Add sell order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = [...existingOrders, sellOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Update holdings - mark quantity as locked (DON'T subtract from quantity yet)
    const holdingsArray = JSON.parse(localStorage.getItem('holdings') || '[]');
    const userAuth = localStorage.getItem('userAuth');
    const currentUser = userAuth ? JSON.parse(userAuth) : null;
    
    if (!currentUser) return;

    // Find and update the specific holding by adding to lockedQuantity
    const updatedHoldings = holdingsArray.map(holding => {
      if (holding.userId === currentUser.id && holding.propertyId === sellOrder.propertyId) {
        return {
          ...holding,
          // Keep original quantity - don't subtract until admin approval
          lockedQuantity: (holding.lockedQuantity || 0) + sellOrder.quantity
        };
      }
      return holding;
    });
    
    localStorage.setItem('holdings', JSON.stringify(updatedHoldings));

    // Show success message
    alert('Sell order submitted – pending approval');
    
    // Reload data and close modal
    loadWalletData();    setSellModalOpen(false);
  };

  const handleCancelPendingOrder = (orderId) => {
    if (!confirm('Are you sure you want to cancel this pending sell order?')) {
      return;
    }

    // Remove the pending order
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderToCancel = existingOrders.find(order => order.id === orderId);
    const updatedOrders = existingOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    if (orderToCancel) {
      // Return the locked quantity back to available
      const holdingsArray = JSON.parse(localStorage.getItem('holdings') || '[]');
      const userAuth = localStorage.getItem('userAuth');
      const currentUser = userAuth ? JSON.parse(userAuth) : null;
      
      if (currentUser) {
        const updatedHoldings = holdingsArray.map(holding => {
          if (holding.userId === currentUser.id && holding.propertyId === orderToCancel.propertyId) {
            return {
              ...holding,
              lockedQuantity: Math.max(0, (holding.lockedQuantity || 0) - orderToCancel.quantity)
            };
          }
          return holding;
        });
        
        localStorage.setItem('holdings', JSON.stringify(updatedHoldings));
      }
    }

    // Reload data
    loadWalletData();
    alert('Pending sell order cancelled successfully');
  };  const calculateTotalGainLossFromTransactions = () => {
    // Calculate gain/loss based on actual transactions
    let totalBuyCost = 0;
    let totalSellValue = 0;
    let currentPortfolioValue = 0;

    // Get all orders for current user (including pending)
    const userAuth = localStorage.getItem('userAuth');
    const currentUser = userAuth ? JSON.parse(userAuth) : null;
    if (!currentUser) return { totalGainLoss: 0, totalGainLossPercent: 0, currentPortfolioValue: 0 };

    const storedOrders = localStorage.getItem('orders');
    const allOrders = storedOrders ? JSON.parse(storedOrders) : [];
    const userOrders = allOrders.filter(order => order.userId === currentUser.id);

    // Calculate total amount spent on buys
    userOrders.forEach(order => {
      if (order.type === 'buy' && (order.status === 'completed' || order.status === 'done')) {
        totalBuyCost += order.totalAmount || (order.quantity * order.pricePerToken);
      } else if (order.type === 'sell' && order.status === 'done') {
        totalSellValue += order.totalValue || (order.quantity * order.price);
      }
    });

    // Calculate current value of holdings (unrealized gains)
    currentPortfolioValue = holdings.reduce((sum, holding) => sum + holding.currentNAV, 0);

    // Total gain/loss = (Current portfolio value + Realized gains from sells) - Total invested
    const totalGainLoss = (currentPortfolioValue + totalSellValue) - totalBuyCost;
    const totalGainLossPercent = totalBuyCost > 0 ? ((totalGainLoss / totalBuyCost) * 100) : 0;

    return { totalGainLoss, totalGainLossPercent, currentPortfolioValue };
  };

  const { totalGainLoss, totalGainLossPercent, currentPortfolioValue } = calculateTotalGainLossFromTransactions();
  const totalPortfolioValue = currentPortfolioValue;

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
          <p className="text-gray-400">Manage your tokenized real estate portfolio</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Portfolio Value</span>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-white">₹{totalPortfolioValue.toFixed(2)}</div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Gain/Loss</span>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{totalGainLoss.toFixed(2)} ({totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Properties</span>
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white">{holdings.length}</div>
          </div>
        </div>        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'holdings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending {pendingOrders.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-black text-xs rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Locked
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Avg Cost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Current NAV
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>                <tbody className="divide-y divide-gray-800">
                  {holdings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No holdings yet</p>
                        <p className="text-sm">Start investing in tokenized real estate</p>
                        <button
                          onClick={() => navigate('/marketplace')}
                          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-2"
                        >
                          <span>Browse Properties</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    holdings.map((holding) => (
                      <tr key={holding.property.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={holding.property.image}
                              alt={holding.property.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {holding.property.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {holding.property.location}
                              </div>
                            </div>
                          </div>
                        </td>                        <td className="px-6 py-4 text-sm text-white">
                          {holding.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <span className="text-green-400">{holding.availableQuantity.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {holding.lockedQuantity > 0 ? (
                            <span className="text-yellow-400">{holding.lockedQuantity.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-500">0</span>
                          )}
                        </td><td className="px-6 py-4 text-sm text-white">
                          ₹{holding.averagePrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{holding.currentNAV.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <MiniTrendChart trend={holding.trend} />
                        </td>
                        <td className="px-6 py-4">                          <div className={`text-sm font-medium ${
                            holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            ₹{holding.gainLoss.toFixed(2)}
                          </div>
                          <div className={`text-xs ${
                            holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {holding.gainLossPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSellClick(holding.property, holding)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ask Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pendingOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No pending orders</p>
                        <p className="text-sm">Your pending sell orders will appear here</p>
                      </td>
                    </tr>
                  ) : (
                    pendingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 text-sm text-white">
                          {order.date || new Date(order.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.propertyName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                            SELL
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{(order.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{(order.totalValue || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                            PENDING APPROVAL
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCancelPendingOrder(order.id)}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No transactions yet</p>
                        <p className="text-sm">Your transaction history will appear here</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 text-sm text-white">
                          {order.date || new Date(order.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.propertyName}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.type === 'buy' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.quantity.toLocaleString()}
                        </td>                        <td className="px-6 py-4 text-sm text-white">
                          ₹{((order.pricePerToken || order.price) || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{((order.totalAmount || order.totalValue) || 0).toFixed(2)}
                        </td>                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed' || order.status === 'done'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sell Modal */}
      <SellModal
        property={selectedProperty}
        holding={selectedHolding}
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onSell={handleSell}
      />
    </div>
  );
};

export default Wallet;
