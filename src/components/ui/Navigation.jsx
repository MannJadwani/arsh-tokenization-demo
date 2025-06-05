import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Building2, User, LogOut, Settings, Bell, ChevronDown, Home, PieChart, Wallet, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [showAdminLink, setShowAdminLink] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem('isLoggedIn');
    const userAuth = localStorage.getItem('userAuth');
    
    if (authStatus && userAuth) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userAuth));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Check authentication status on mount and route changes
    checkAuthStatus();
  }, [location.pathname]); // Added location.pathname as dependency

  useEffect(() => {
    // Listen for storage changes (when localStorage is updated from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' || e.key === 'userAuth') {
        checkAuthStatus();
      }
    };

    // Listen for custom events (for same-tab localStorage changes)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('isLoggedIn');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileOpen(false);
    navigate('/');
  };
  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  };

  const handleProfileClick = () => {
    if (!isProfileOpen) {
      calculateDropdownPosition();
    }
    setIsProfileOpen(!isProfileOpen);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleLogoDoubleClick = () => {
    setShowAdminLink(prev => !prev);
  };

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isKycPage = location.pathname === '/kyc';
  return (
    <nav className={`${isHomePage && !isLoggedIn ? 'absolute top-0 left-0 right-0 bg-transparent' : 'bg-black/90'} ${isHomePage ? 'z-50' : ''} backdrop-blur-lg border-b border-gray-800/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavigation('/')}
            onDoubleClick={handleLogoDoubleClick}
          >
            <Building2 className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white">EstateWallet</span>
          </div>

          {/* Navigation Links - only show on landing page when not logged in */}
          {isHomePage && !isLoggedIn && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#spvs" className="text-gray-300 hover:text-white transition-colors">SPVs</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#security" className="text-gray-300 hover:text-white transition-colors">Security</a>
            </div>
          )}          {/* Dashboard Navigation - only show when logged in and not on auth/kyc pages */}
          {isLoggedIn && !isAuthPage && !isHomePage && !isKycPage && (
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/home' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/marketplace')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/marketplace' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Marketplace</span>
              </button>              <button className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-900/50 px-3 py-2 rounded-lg transition-colors">
                <PieChart className="h-4 w-4" />
                <span>Portfolio</span>
              </button>
              <button
                onClick={() => handleNavigation('/wallet')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/wallet' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span>Wallet</span>
              </button>
            </div>
          )}

          {/* Right Side - Auth Status */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>                {/* Notifications - only show on dashboard pages */}
                {!isHomePage && !isAuthPage && !isKycPage && (
                  <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>                  <button
                    ref={buttonRef}
                    onClick={handleProfileClick}
                    className="flex items-center space-x-3 bg-black/50 hover:bg-gray-900/70 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{getUserInitials()}</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-400">{user?.email}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>                </div>
              </>
            ) : (
              // Auth Buttons - only show when not logged in and not on auth/kyc pages
              !isAuthPage && !isKycPage && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Get Started
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Dropdown Menu Portal */}
      {isProfileOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-64 bg-black border border-gray-800 rounded-xl shadow-lg py-2 z-[99999]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{getUserInitials()}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => handleNavigation('/home')}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900/50 w-full transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation('/marketplace')}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900/50 w-full transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Marketplace</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/wallet')}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900/50 w-full transition-colors"
            >
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </button>
            
            <button className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900/50 w-full transition-colors">
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </button>
            
            <button className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900/50 w-full transition-colors">
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </button>
            
            <div className="border-t border-gray-800 my-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>,
        document.body
      )}
      
      {/* Admin Link - Hidden by default, shows on logo double-click */}
      {showAdminLink && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => handleNavigation('/admin?admin=1')}
            className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            Admin Panel
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;