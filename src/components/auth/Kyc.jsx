import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, FileText, User, Camera, Building2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Kyc = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const userAuth = localStorage.getItem('userAuth');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !userAuth) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userAuth);
    setUser(userData);
    
    // Check if KYC is already approved
    if (userData.kyc === 'approved') {
      navigate('/home');
    }
  }, [navigate]);

  const handleCompleteKyc = async () => {
    setIsLoading(true);
    
    // Simulate KYC processing time
    setTimeout(() => {
      const updatedUser = {
        ...user,
        kyc: 'approved',
        kycCompletedAt: new Date().toISOString()
      };
      
      localStorage.setItem('userAuth', JSON.stringify(updatedUser));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authChange'));
      
      setUser(updatedUser);
      setKycCompleted(true);
      setIsLoading(false);
      
      // Auto-redirect after success animation
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (kycCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            KYC Approved!
          </h1>
          <p className="text-gray-400 mb-6">Your account has been verified successfully.</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Complete Your KYC
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            To ensure security and compliance, we need to verify your identity before you can start investing in tokenized real estate.
          </p>
        </div>

        {/* KYC Requirements */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <p className="text-gray-400 text-sm">
              Basic details including full name, date of birth, and contact information for identity verification.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Document Upload</h3>
            <p className="text-gray-400 text-sm">
              Government-issued ID (Aadhaar, PAN Card, Passport) and address proof for verification purposes.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Selfie Verification</h3>
            <p className="text-gray-400 text-sm">
              Take a quick selfie to match with your uploaded documents and complete the verification process.
            </p>
          </div>
        </div>

        {/* Main KYC Card */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-lg mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-blue-500 mr-3" />
              <div className="text-left">
                <h2 className="text-2xl font-bold">EstateWallet KYC</h2>
                <p className="text-gray-400">Secure & Compliant Verification</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Why KYC is Required?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Regulatory compliance with financial laws</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Protection against fraud and money laundering</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Secure your investments and transactions</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Access to premium investment opportunities</span>
                </div>
              </div>
            </div>

            {/* KYC Process Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-6">Verification Process</h3>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm">Upload Documents</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 hidden md:block" />
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm">AI Verification</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 hidden md:block" />
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm">Instant Approval</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCompleteKyc}
              disabled={isLoading}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Complete KYC Verification
                </div>
              )}
            </button>

            {isLoading && (
              <div className="mt-4 text-sm text-gray-400">
                <p>Please wait while we verify your documents...</p>
                <p className="text-xs mt-1">This usually takes 1-2 minutes</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Shield className="h-6 w-6 text-blue-400 mr-2" />
            <span className="font-semibold text-blue-400">Secure & Encrypted</span>
          </div>
          <p className="text-sm text-gray-300">
            Your personal information is protected with bank-grade encryption and will never be shared with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
