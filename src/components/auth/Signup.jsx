import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, Shield, CheckCircle, Star } from 'lucide-react';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToUpdates: false
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid) {
      // Create user account
      const userData = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        kyc: 'pending',
        createdAt: new Date().toISOString(),
        isAuthenticated: false
      };
      
      localStorage.setItem('userAuth', JSON.stringify(userData));
      
      console.log('Signup successful:', userData);
      alert('Account created successfully! Please complete KYC verification.');
      
      // Redirect to KYC page
      navigate('/kyc');
    }
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone;
  const isStep2Valid = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.agreeToTerms;
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8 pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-500" />
            <span className="ml-3 text-3xl font-bold">EstateWallet</span>
          </div>
          <p className="text-gray-400">Join the future of real estate investing</p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-4 backdrop-blur-sm">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Start Your Investment Journey
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create Account
              </span>
            </h1>
            <p className="text-gray-400">Get started with as little as ₹1,000</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  currentStep >= 1 ? 'border-blue-400 bg-blue-400/20' : 'border-gray-500'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Personal Info</span>
              </div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  currentStep >= 2 ? 'border-blue-400 bg-blue-400/20' : 'border-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Security</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-sm">Passwords do not match</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                      required
                    />
                    <span className="ml-3 text-sm text-gray-300">
                      I agree to the{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToUpdates"
                      checked={formData.agreeToUpdates}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                    />
                    <span className="ml-3 text-sm text-gray-300">
                      Send me updates about new investment opportunities
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center group"
              >
                <span>{currentStep === 2 ? 'Create Account' : 'Continue'}</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-400" />
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-400" />
              <span>SEBI regulated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
