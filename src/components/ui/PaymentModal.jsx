import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building, 
  Check, 
  Lock,
  AlertCircle,
  Loader
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, orderDetails, onPaymentSuccess }) => {
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
      
      // Call success callback after 2 seconds
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">
            {currentStep === 1 && 'Billing Information'}
            {currentStep === 2 && 'Payment Method'}
            {currentStep === 3 && 'Processing Payment'}
            {currentStep === 4 && 'Payment Successful'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-700/30 border-b border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Property:</span>
              <span>{orderDetails.propertyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tokens:</span>
              <span>{orderDetails.quantity} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price per Token:</span>
              <span>₹{orderDetails.pricePerToken.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-600">
              <span>Total Amount:</span>
              <span className="text-blue-400">₹{orderDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Step 1: Billing Information */}
        {currentStep === 1 && (
          <form onSubmit={handleBillingSubmit} className="p-6 space-y-4">
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="flex items-center text-sm text-gray-400 mt-4">
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
          <div className="p-6">
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border rounded-xl transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <span className="block text-sm font-medium">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border rounded-xl transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mx-auto mb-2" />
                  <span className="block text-sm font-medium">UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 border rounded-xl transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Building className="h-6 w-6 mx-auto mb-2" />
                  <span className="block text-sm font-medium">Net Banking</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
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

              <div className="flex items-center text-sm text-gray-400 mt-4">
                <Lock className="h-4 w-4 mr-2" />
                <span>Secure payment powered by 256-bit SSL encryption</span>
              </div>

              <div className="flex justify-between pt-4">
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
          <div className="p-8 text-center">
            <div className="mb-6">
              <Loader className="h-16 w-16 text-blue-400 mx-auto animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-400 mb-4">Please wait while we process your payment...</p>
            <div className="text-sm text-gray-500">
              Do not close this window or refresh the page
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-4">
              Your payment of ₹{orderDetails.totalAmount.toLocaleString()} has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal; 