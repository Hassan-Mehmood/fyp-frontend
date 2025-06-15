"use client";
import Link from 'next/link'; // Import Link from next/link
import React, { useState } from 'react';
import { 
  Home, User, Bot, PlusCircle, CreditCard, Clock, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

// SidebarItem Component with Link
const SidebarItem = ({ icon, label, href, isOpen }) => (
  <li>
    <Link href={href} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out">
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  </li>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // State for open/close sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar state
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with fixed position */}
      <div className={`bg-gray-900 text-gray-300 h-screen fixed top-0 left-0 p-4 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-8">
          {isOpen && <h1 className="text-2xl font-bold text-white">Instant Bots</h1>}
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            {/* Home Page Link */}
            <SidebarItem icon={<Home size={20} />} label="Home" href="/home" isOpen={isOpen} />
            
            {/* Profile Page Link */}
            <SidebarItem icon={<User size={20} />} label="Profile" href="/profile" isOpen={isOpen} />
            
            
            {/* Character Selection Page Link */}
            <SidebarItem icon={<Bot size={20} />} label="Character Selection" href="/character-selection" isOpen={isOpen} />
            
            {/* Create Custom Bot Link */}
            <SidebarItem icon={<PlusCircle size={20} />} label="Create Custom Bot" href="/custom-bot" isOpen={isOpen} />
            
            {/* Credits Page Link */}
            <SidebarItem icon={<CreditCard size={20} />} label="Credits: 100" href="/credits" isOpen={isOpen} />      
            {/* Chat History Page Link */}
            <SidebarItem icon={<Clock size={20} />} label="Chat History" href="/chat-history" isOpen={isOpen} />
          </ul>
        </nav>

        {/* Settings, Help, and Logout at the Bottom */}
        <div className="mt-auto border-t border-gray-700 pt-4">
          <ul className="space-y-2">
            <SidebarItem icon={<Settings size={20} />} label="Settings" href="/settings" isOpen={isOpen} />
            <SidebarItem icon={<HelpCircle size={20} />} label="Help/FAQ" href="/help" isOpen={isOpen} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
