"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Home,
  User,
  Bot,
  PlusCircle,
  CreditCard,
  Clock,
  Sun,
  Moon,
  ArrowUpRight,
  X,
  Menu
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from '@clerk/nextjs';

const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeItem, setActiveItem] = useState("Home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Check if device is mobile
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navigationItems = [
    { icon: <Home size={18} />, label: "Home", href: "/home", requiresAuth: false },
    { icon: <User size={18} />, label: "Profile", href: "/profile", requiresAuth: true },
    { icon: <Bot size={18} />, label: "Character Selection", href: "/character-selection", requiresAuth: true },
    { icon: <PlusCircle size={18} />, label: "Create Custom Bot", href: "/custom-bot", requiresAuth: true },
    { icon: <CreditCard size={18} />, label: "Credits: 100", href: "/credits", requiresAuth: true },
    { icon: <Clock size={18} />, label: "Chat History", href: "/chat-history", requiresAuth: true }
  ];

  const handleClick = (label, href, requiresAuth) => {
    // Check if authentication is required and user is not signed in
    if (requiresAuth && !isSignedIn) {
      setShowAuthModal(true);
      return;
    }
    
    setActiveItem(label);
    router.push(href);
    
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`p-6 rounded-lg max-w-md w-full ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sign In Required</h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Please sign in to access this feature and start using our AI bots.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <SignInButton mode="modal">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
              Sign In
            </button>
          </SignInButton>
          <button
            onClick={() => setShowAuthModal(false)}
            className={`flex-1 py-2 px-4 rounded-lg border transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const SidebarItem = ({ icon, label, href, isActive, requiresAuth }) => {
    const isDisabled = requiresAuth && !isSignedIn;
    
    return (
      <li>
        <button
          onClick={() => handleClick(label, href, requiresAuth)}
          disabled={!isLoaded} // Disable while auth is loading
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
            isActive
              ? isDarkMode 
                ? "bg-gray-700 text-white" 
                : "bg-blue-50 text-blue-600"
              : isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          } ${isDisabled ? 'opacity-60' : ''}`}
        >
          <div className="flex-shrink-0">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
          {isDisabled && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          )}
        </button>
      </li>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center mb-6 md:mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Instant Bots
        </h1>
      </div>

      {/* Auth Status Indicator */}
      {isLoaded && (
        <div className={`mb-4 p-3 rounded-lg ${
          isSignedIn 
            ? isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
            : isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isSignedIn ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              isSignedIn 
                ? isDarkMode ? 'text-green-300' : 'text-green-700'
                : isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              {isSignedIn ? 'Signed In' : 'Not Signed In'}
            </span>
          </div>
        </div>
      )}


      {/* Navigation Section */}
      <div className="mb-6 flex-1">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          NAVIGATION
        </h2>
        <nav>
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={activeItem === item.label}
                requiresAuth={item.requiresAuth}
              />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`mobile-menu-button fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } shadow-lg md:hidden`}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <aside className={`sidebar-container w-64 h-screen p-4 flex flex-col shadow-lg transition-transform duration-300 ${
          isDarkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'
        } ${
          isMobile 
            ? `fixed top-0 left-0 z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0'
        }`}>
          
          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } md:hidden`}
            >
              <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
            </button>
          )}

          <SidebarContent />
        </aside>
      </div>

      {/* Main Content Spacer - only on desktop */}
      {!isMobile && (
        <div className="w-64 flex-shrink-0" />
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}
    </>
  );
};

export default Sidebar;