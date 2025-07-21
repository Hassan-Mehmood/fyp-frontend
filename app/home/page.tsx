"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, PlusCircle, CreditCard, MessageSquare, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import axios from 'axios';
import axiosInstance from '@/utils/axios';

const FeatureCard = ({ icon, title, description, href, gradient = false }) => (
  <Link href={href} className="h-full flex">
  <div className={`flex flex-col h-full group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
    gradient 
      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6' 
      : 'bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
  }`}>
    <div className={`flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
      gradient 
        ? 'bg-white/20' 
        : 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
    }`}>
      {icon}
    </div>
    <h3 className={`text-lg font-semibold mb-2 ${gradient ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
      {title}
    </h3>
    <p className={`text-sm mb-4 ${gradient ? 'text-white/80' : 'text-gray-600 dark:text-gray-300'}`}>
      {description}
    </p>

    {/* This pushes the CTA to the bottom */}
    <div className="mt-auto">
      <div className={`flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform ${
        gradient ? 'text-white' : 'text-blue-600 dark:text-blue-400'
      }`}>
        Get Started <ArrowRight size={16} className="ml-1" />
      </div>
    </div>

    {gradient && (
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
    )}
  </div>
</Link>

);

const StatCard = ({ number, label, icon, loading = false }) => (
  <div className="text-center">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg mx-auto mb-3">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {loading ? (
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-16 rounded mx-auto"></div>
      ) : (
        number
      )}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const HomePage = () => {
  const { user, isLoaded } = useUser();
 const [creditsData, setCreditsData] = useState({
  credits: 0,
  totalCredits: 0,
  bots: 0,
  loading: true,
  error: null
});
  const [conversationCount, setConversationCount] = useState(0);

  // Fetch credits data
useEffect(() => {
  const fetchCreditsData = async () => {
    if (!isLoaded || !user?.id) return;

    try {
      setCreditsData(prev => ({ ...prev, loading: true, error: null }));

      const response = await axiosInstance.get(`/aggregate/${user.id}`);

      const data = response.data;

      setCreditsData({
      credits: data.total_credits || 0,
      totalCredits: data.total_credits || 0,
      bots: data.bots || 0,
      loading: false,
      error: null,
    });

    } catch (error) {
      console.error('Error fetching credits data:', error);
      setCreditsData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load credits',
      }));
    }
  };

  fetchCreditsData();
}, [user?.id, isLoaded]);


  useEffect(() => {
    const fetchConversationCount = async () => {
      if (!isLoaded || !user?.id) {
        return;
      }

      try {
        // Replace with your actual conversation count API endpoint
        // const response = await fetch(`/api/conversations/count/${user.id}`);
        // const data = await response.json();
        // setConversationCount(data.count || 0);
        
        // For now, keeping it as 0 since the API endpoint isn't specified
        setConversationCount(0);
      } catch (error) {
        console.error('Error fetching conversation count:', error);
        setConversationCount(0);
      }
    };

    fetchConversationCount();
  }, [user?.id, isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Instant Bots
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal AI companions for engaging conversations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        {/* Quick Actions */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/character-selection" className="flex-1">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Choose a Character</h3>
                    <p className="text-blue-100 text-sm">Start chatting with pre-built AI companions</p>
                  </div>
                  <Bot size={32} className="group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </Link>
            <Link href="/custom-bot" className="flex-1">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Create Custom Bot</h3>
                    <p className="text-purple-100 text-sm">Design your own AI personality</p>
                  </div>
                  <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {creditsData.error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{creditsData.error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
              number={creditsData.loading ? '' : creditsData.bots.toString()} 
              label="Available Characters" 
              icon={<Users size={20} />} 
              loading={creditsData.loading}
            />
              <StatCard 
                number={creditsData.loading ? '' : creditsData.credits.toString()} 
                label="Available Credits" 
                icon={<CreditCard size={20} />} 
                loading={creditsData.loading}
              />
            </div>
            
            {/* Additional Credits Info */}
            <SignedIn>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Credits Earned: 
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">
                      {creditsData.loading ? '...' : creditsData.totalCredits}
                    </span>
                  </span>
                  <Link 
                    href="/credits" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Manage Credits →
                  </Link>
                </div>
              </div>
            </SignedIn>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Features</h2>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              <Sparkles size={16} className="mr-1" />
              Powered by AI
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-full flex">
              <FeatureCard
                icon={<Bot size={24} />}
                title="Role-Based Characters"
                description="Choose from a variety of pre-configured characters with unique personalities"
                href="/character-selection"
              />
            </div>
            <div className="h-full flex">
              <FeatureCard
                icon={<PlusCircle size={24} />}
                title="Custom Bot Creation"
                description="Design and personalize your own AI companions with custom traits"
                href="/custom-bot"
                gradient={true}
              />
            </div>
            <div className="h-full flex">
              <FeatureCard
                icon={<CreditCard size={24} />}
                title="Flexible Credits"
                description="Access premium features with our transparent credit system"
                href="/credits"
              />
            </div>
            <div className="h-full flex">
              <FeatureCard
                icon={<MessageSquare size={24} />}
                title="Smart Conversations"
                description="Enjoy context-aware chats that remember your preferences"
                href="/chat-history"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;