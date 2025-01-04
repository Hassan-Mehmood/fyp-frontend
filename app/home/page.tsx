
import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Bot, PlusCircle, CreditCard, MessageSquare } from 'lucide-react';

const FeatureCard = ({ icon, title, description, href }) => (
  <Link href={href}>
    <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-transform duration-300">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-500 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

const HomePage = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-900">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Instant Bots</h1>
        <p className="text-xl text-gray-300">Your personal AI companions for engaging conversations</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white">Get Started</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          {/* Link to Character Selection Page */}
          <Link href="/character-selection">
            <button className="w-64 bg-blue-500 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-600 transition duration-300">
              Choose a Character
            </button>
          </Link>
          {/* Link to Create Custom Bot Page */}
          <Link href="/custom-bot">
            <button className="w-64 bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 transition duration-300">
              Create Custom Bot
            </button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
            icon={<Bot size={24} />}
            title="Role-Based Characters"
            description="Choose from a variety of pre-configured characters or create your own"
            href="/character-selection" // Navigates to the Character Selection page
          />
          <FeatureCard
            icon={<PlusCircle size={24} />}
            title="Custom Bot Creation"
            description="Design and personalize your own AI companions"
            href="/custom-bot" // Navigates to the Custom Bot Creation page
          />
          <FeatureCard
            icon={<CreditCard size={24} />}
            title="Premium Features"
            description="Access premium bots and features with our flexible credit system"
            href="/credits" // Navigates to the Credits page
          />
          <FeatureCard
            icon={<MessageSquare size={24} />}
            title="Context-Aware Chats"
            description="Enjoy dynamic conversations tailored to your chosen characters"
            href="/chat-history" // Navigates to the Chat History or Start Chat page
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white">Recent Conversations</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-300 mb-4">You haven't had any conversations yet. Start chatting with a bot to see your recent interactions here!</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Start a New Chat
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
