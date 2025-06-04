import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  CreditCard, 
  Smartphone, 
  Building, 
  Check, 
  Lock,
  Shield,
  Loader
} from 'lucide-react';

const Billing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Billing, 2: Payment, 3: Processing, 4: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNumber: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [upiInfo, setUpiInfo] = useState({
    upiId: ''
  });

  const [netBankingInfo, setNetBankingInfo] = useState({
    bankName: ''
  });

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

    // Get order details from navigation state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else {
      // If no order details, redirect to marketplace
      navigate('/marketplace');
    }
  }, [navigate, location]);

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCurrentStep(3);

    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep(4);
      
      // Complete the purchase after successful payment
      setTimeout(() => {
        completePurchase();
      }, 2000);
    }, 3000);
  };

  const completePurchase = () => {
    if (!orderDetails || !user) return;

    // Create order
    const order = {
      id: Date.now(),
      type: 'buy',
      propertyId: orderDetails.propertyId,
      propertyName: orderDetails.propertyName,
      quantity: orderDetails.quantity,
      pricePerToken: orderDetails.pricePerToken,
      totalAmount: orderDetails.totalAmount,
      status: 'completed',
      timestamp: new Date().toISOString(),
      userId: user.id,
      billingInfo: billingInfo,
      paymentMethod: paymentMethod
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Update holdings
    const existingHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const existingHolding = existingHoldings.find(h => h.propertyId === orderDetails.propertyId && h.userId === user.id);
    
    if (existingHolding) {
      existingHolding.quantity += orderDetails.quantity;
      existingHolding.totalInvested += orderDetails.totalAmount;
      existingHolding.avgPrice = existingHolding.totalInvested / existingHolding.quantity;
    } else {
      existingHoldings.push({
        id: Date.now(),
        userId: user.id,
        propertyId: orderDetails.propertyId,
        propertyName: orderDetails.propertyName,
        quantity: orderDetails.quantity,
        totalInvested: orderDetails.totalAmount,
        avgPrice: orderDetails.pricePerToken,
        purchaseDate: new Date().toISOString()
      });
    }
    
    localStorage.setItem('holdings', JSON.stringify(existingHoldings));

    // Update property sold tokens
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const updatedProperties = properties.map(p => {
      if (p.id === orderDetails.propertyId) {
        const newSoldTokens = p.soldTokens + orderDetails.quantity;
        return {
          ...p,
          soldTokens: newSoldTokens,
          fundingProgress: Math.round((newSoldTokens / p.totalTokens) * 100)
        };
      }
      return p;
    });
    
    localStorage.setItem('properties', JSON.stringify(updatedProperties));

    // Navigate to wallet after successful purchase
    setTimeout(() => {
      navigate('/wallet');
    }, 3000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const banksList = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'Central Bank of India'
  ];

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {currentStep === 1 && 'Billing Information'}
            {currentStep === 2 && 'Payment Method'}
            {currentStep === 3 && 'Processing Payment'}
            {currentStep === 4 && 'Payment Successful'}
          </h1>
          <p className="text-gray-400">Complete your token purchase securely</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>Billing Info</span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>Payment</span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>Processing</span>
            <span className={`text-sm ${currentStep >= 4 ? 'text-green-400' : 'text-gray-500'}`}>Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Property:</span>
                  <span className="text-right">{orderDetails.propertyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tokens:</span>
                  <span>{orderDetails.quantity} tokens</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per Token:</span>
                  <span>₹{orderDetails.pricePerToken.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-blue-400">₹{orderDetails.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure SSL encrypted transaction</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              {/* Step 1: Billing Information */}
              {currentStep === 1 && (
                <form onSubmit={handleBillingSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.fullName}
                        onChange={(e) => setBillingInfo({...billingInfo, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">PAN Number *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.panNumber}
                        onChange={(e) => setBillingInfo({...billingInfo, panNumber: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your PAN number"
                        maxLength="10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                    <textarea
                      required
                      rows="3"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.pincode}
                        onChange={(e) => setBillingInfo({...billingInfo, pincode: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PIN Code"
                        maxLength="6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-400">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Your information is secured with 256-bit SSL encryption</span>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="p-8">
                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6">Select Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-6 border rounded-xl transition-all ${
                          paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <CreditCard className="h-8 w-8 mx-auto mb-3" />
                        <span className="block text-sm font-medium">Credit/Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-6 border rounded-xl transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <Smartphone className="h-8 w-8 mx-auto mb-3" />
                        <span className="block text-sm font-medium">UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-6 border rounded-xl transition-all ${
                          paymentMethod === 'netbanking'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <Building className="h-8 w-8 mx-auto mb-3" />
                        <span className="block text-sm font-medium">Net Banking</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo({...cardInfo, cardNumber: formatCardNumber(e.target.value)})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Name on Card</label>
                          <input
                            type="text"
                            required
                            value={cardInfo.nameOnCard}
                            onChange={(e) => setCardInfo({...cardInfo, nameOnCard: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter name as on card"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              required
                              value={cardInfo.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                }
                                setCardInfo({...cardInfo, expiryDate: value});
                              }}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                            <input
                              type="password"
                              required
                              value={cardInfo.cvv}
                              onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="123"
                              maxLength="3"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Payment Form */}
                    {paymentMethod === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
                        <input
                          type="text"
                          required
                          value={upiInfo.upiId}
                          onChange={(e) => setUpiInfo({...upiInfo, upiId: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="yourname@paytm"
                        />
                      </div>
                    )}

                    {/* Net Banking Form */}
                    {paymentMethod === 'netbanking' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Bank</label>
                        <select
                          required
                          value={netBankingInfo.bankName}
                          onChange={(e) => setNetBankingInfo({...netBankingInfo, bankName: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select your bank</option>
                          {banksList.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-400">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Secure payment powered by 256-bit SSL encryption</span>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200"
                      >
                        Pay ₹{orderDetails.totalAmount.toLocaleString()}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Processing */}
              {currentStep === 3 && (
                <div className="p-12 text-center">
                  <div className="mb-8">
                    <Loader className="h-20 w-20 text-blue-400 mx-auto animate-spin" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Processing Payment</h3>
                  <p className="text-gray-400 mb-6">Please wait while we process your payment...</p>
                  <div className="text-sm text-gray-500">
                    Do not close this window or refresh the page
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="p-12 text-center">
                  <div className="mb-8">
                    <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Payment Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    Your payment of ₹{orderDetails.totalAmount.toLocaleString()} has been processed successfully.
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    You will receive a confirmation email shortly. Redirecting to your wallet...
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing; 