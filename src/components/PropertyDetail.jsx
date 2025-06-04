import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Shield,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import PaymentModal from './ui/PaymentModal';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tokenQuantity, setTokenQuantity] = useState(1);

  useEffect(() => {
    // Check authentication and KYC status
    const authStatus = localStorage.getItem('isLoggedIn');
    const userAuth = localStorage.getItem('userAuth');
    
    if (!authStatus || !userAuth) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userAuth);
    if (userData.kyc !== 'approved') {
      navigate('/kyc');
      return;
    }

    setUser(userData);

    // Get property data
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const foundProperty = properties.find(p => p.id === parseInt(id));
    
    if (!foundProperty) {
      navigate('/marketplace');
      return;
    }

    setProperty(foundProperty);
    setLoading(false);
  }, [id, navigate]);

  const handleBuyTokens = () => {
    if (!property || !user) return;

    const totalCost = tokenQuantity * property.pricePerToken;
    
    // Create order
    const order = {
      id: Date.now(),
      type: 'buy',
      propertyId: property.id,
      propertyName: property.name,
      quantity: tokenQuantity,
      pricePerToken: property.pricePerToken,
      totalAmount: totalCost,
      status: 'completed',
      timestamp: new Date().toISOString(),
      userId: user.id
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Update holdings
    const existingHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const existingHolding = existingHoldings.find(h => h.propertyId === property.id && h.userId === user.id);
    
    if (existingHolding) {
      existingHolding.quantity += tokenQuantity;
      existingHolding.totalInvested += totalCost;
      existingHolding.avgPrice = existingHolding.totalInvested / existingHolding.quantity;
    } else {
      existingHoldings.push({
        id: Date.now(),
        userId: user.id,
        propertyId: property.id,
        propertyName: property.name,
        quantity: tokenQuantity,
        totalInvested: totalCost,
        avgPrice: property.pricePerToken,
        purchaseDate: new Date().toISOString()
      });
    }
    
    localStorage.setItem('holdings', JSON.stringify(existingHoldings));

    // Update property sold tokens
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const updatedProperties = properties.map(p => {
      if (p.id === property.id) {
        const newSoldTokens = p.soldTokens + tokenQuantity;
        return {
          ...p,
          soldTokens: newSoldTokens,
          fundingProgress: Math.round((newSoldTokens / p.totalTokens) * 100)
        };
      }
      return p;
    });
    
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    // Update local state
    setProperty(prev => ({
      ...prev,
      soldTokens: prev.soldTokens + tokenQuantity,
      fundingProgress: Math.round(((prev.soldTokens + tokenQuantity) / prev.totalTokens) * 100)
    }));

    // Show success message and close modal
    alert(`Successfully purchased ${tokenQuantity} tokens for ₹${totalCost.toLocaleString()}!`);
    setShowBuyModal(false);
    setShowPaymentModal(false);
    setTokenQuantity(1);
  };

  const handleProceedToPayment = () => {
    setShowBuyModal(false);
    setShowPaymentModal(true);
  };

  const adjustQuantity = (change) => {
    const newQuantity = Math.max(1, Math.min(tokenQuantity + change, property.totalTokens - property.soldTokens));
    setTokenQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const availableTokens = property.totalTokens - property.soldTokens;
  const totalCost = tokenQuantity * property.pricePerToken;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Property Image */}
          <div className="space-y-6">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-3 py-2 rounded-full text-sm font-medium">
                  {property.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-green-500/20 backdrop-blur-sm text-green-300 px-3 py-2 rounded-full text-sm font-bold">
                  {property.expectedYield}% APY
                </span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-400" />
                  <div>
                    <div className="text-lg font-bold">₹{(property.propertyValue / 10000000).toFixed(1)}Cr</div>
                    <div className="text-sm text-gray-400">Property Value</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <div>
                    <div className="text-lg font-bold">{property.expectedYield}%</div>
                    <div className="text-sm text-gray-400">Expected Yield</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
              <div className="flex items-center text-gray-400 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}, {property.city}</span>
              </div>
              <p className="text-gray-300 text-lg">{property.description}</p>
            </div>

            {/* Tokenomics Table */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Tokenomics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Price per Token</span>
                  <span className="font-semibold text-lg">₹{property.pricePerToken.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Total Tokens</span>
                  <span className="font-semibold">{property.totalTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Tokens Sold</span>
                  <span className="font-semibold">{property.soldTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Available Tokens</span>
                  <span className="font-semibold text-green-400">{availableTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Minimum Investment</span>
                  <span className="font-semibold">₹{property.minInvestment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Funding Progress</h3>
                <span className="text-2xl font-bold text-blue-400">{property.fundingProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${property.fundingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>₹{((property.soldTokens * property.pricePerToken) / 10000000).toFixed(1)}Cr raised</span>
                <span>₹{(property.propertyValue / 10000000).toFixed(1)}Cr goal</span>
              </div>
            </div>

            {/* Buy Tokens Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Buy Tokens</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Available:</span>
                  <span className="font-semibold">{availableTokens.toLocaleString()} tokens</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowBuyModal(true)}
                    disabled={availableTokens === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    {availableTokens === 0 ? 'Fully Funded' : 'Quick Buy'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/billing', {
                        state: {
                          orderDetails: {
                            propertyId: property.id,
                            propertyName: property.name,
                            quantity: 1,
                            pricePerToken: property.pricePerToken,
                            totalAmount: property.pricePerToken
                          }
                        }
                      });
                    }}
                    disabled={availableTokens === 0}
                    className="bg-gray-700 hover:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-600"
                  >
                    {availableTokens === 0 ? 'Fully Funded' : 'Detailed Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Chart Placeholder */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Historical Performance</h3>
          <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500">Performance chart coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Buy Tokens</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity (Max: {availableTokens.toLocaleString()})
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    disabled={tokenQuantity <= 1}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={availableTokens}
                    value={tokenQuantity}
                    onChange={(e) => setTokenQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, availableTokens)))}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => adjustQuantity(1)}
                    disabled={tokenQuantity >= availableTokens}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Token:</span>
                  <span className="font-semibold">₹{property.pricePerToken.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="font-semibold">{tokenQuantity} tokens</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="font-bold text-blue-400">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={{
            propertyName: property.name,
            quantity: tokenQuantity,
            pricePerToken: property.pricePerToken,
            totalAmount: tokenQuantity * property.pricePerToken
          }}
          onPaymentSuccess={handleBuyTokens}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
