import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building2, ArrowRight, Shield, CheckCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user exists in localStorage
    const existingUserAuth = localStorage.getItem('userAuth');
    
    if (formData.email && formData.password && existingUserAuth) {
      const existingUser = JSON.parse(existingUserAuth);
      
      // Simple validation - check if email matches
      if (existingUser.email === formData.email) {
        // Update login timestamp
        const updatedUser = {
          ...existingUser,
          loginAt: new Date().toISOString(),
          isAuthenticated: true
        };
        
        localStorage.setItem('userAuth', JSON.stringify(updatedUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Login successful:', updatedUser);
        alert('Login successful!');
        
        // Check KYC status and redirect accordingly
        if (updatedUser.kyc === 'approved') {
          window.location.href = '/home';
        } else {
          window.location.href = '/kyc';
        }
      } else {
        alert('Invalid email or password');
      }
    } else if (formData.email && formData.password) {
      // Fallback for demo purposes - create user with pending KYC
      const userData = {
        id: Date.now(),
        email: formData.email,
        firstName: 'Demo',
        lastName: 'User',
        kyc: 'pending',
        loginAt: new Date().toISOString(),
        isAuthenticated: true
      };
      
      localStorage.setItem('userAuth', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      console.log('Login successful (new user):', userData);
      alert('Login successful! Please complete KYC verification.');
      window.location.href = '/kyc';
    } else {
      alert('Please enter valid credentials');
    }
  };
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
          <p className="text-gray-400">Welcome back to the future of real estate investing</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sign In
              </span>
            </h1>
            <p className="text-gray-400">Access your real estate portfolio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center group"
            >
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one now
              </a>
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

export default Login;
