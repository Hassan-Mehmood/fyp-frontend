"use client";
import React, { useState } from "react";
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
  ArrowUpRight
} from "lucide-react";
import { useRouter } from 'next/navigation';


const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeItem, setActiveItem] = useState("Home");
 const router = useRouter();


  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navigationItems = [
    { icon: <Home size={18} />, label: "Home", href: "/home" },
    { icon: <User size={18} />, label: "Profile", href: "/profile" },
    { icon: <Bot size={18} />, label: "Character Selection", href: "/character-selection" },
    { icon: <PlusCircle size={18} />, label: "Create Custom Bot", href: "/custom-bot" },
    { icon: <CreditCard size={18} />, label: "Credits: 100", href: "/credits" },
    { icon: <Clock size={18} />, label: "Chat History", href: "/chat-history" }
  ];
const handleClick = (label, href) => {
    setActiveItem(label);
    router.push(href); 
  };
  const SidebarItem = ({ icon, label, href, isActive, onClick }) => (
    <li>
      <button
        onClick={() => handleClick(label, href)}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
          isActive
            ? isDarkMode 
              ? "bg-gray-700 text-white" 
              : "bg-blue-50 text-blue-600"
            : isDarkMode
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    </li>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <aside className={`w-64 h-screen fixed top-0 left-0 p-4 flex flex-col shadow-lg ${isDarkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}`}>
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Instant Bots
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500/20' : 'focus:ring-blue-500/20'}`}
          />
          <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            ⌘
          </span>
        </div>

        {/* Navigation Section */}
        <div className="mb-6">
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
                  onClick={setActiveItem}
                />
              ))}
            </ul>
          </nav>
        </div>

        {/* Upgrade Card */}
        <div className="mt-auto mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Bot size={16} />
              </div>
              <h3 className="font-semibold text-sm mb-1">Bot Limit</h3>
              <p className="text-xs text-white/80 mb-3">
                5/10 Active Bots
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white text-xs font-medium py-2 px-3 rounded-lg backdrop-blur-sm">
                Learn more
              </button>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
          </div>
        </div>

        {/* Upgrade Plan Button */}
        <button className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 mb-4 ${
          isDarkMode 
            ? 'bg-white text-gray-900 hover:bg-gray-100' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}>
          Upgrade plan
          <ArrowUpRight size={14} className="inline ml-2" />
        </button>

        {/* Theme Toggle */}
        <div className="flex items-center justify-center">
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 flex items-center justify-center ${
              isDarkMode 
                ? 'transform translate-x-6 bg-yellow-400' 
                : 'transform translate-x-0 bg-white'
            }`}>
              {isDarkMode ? (
                <Sun size={12} className="text-gray-900" />
              ) : (
                <Moon size={12} className="text-gray-600" />
              )}
            </div>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;