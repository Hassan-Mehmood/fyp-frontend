"use client"
import React, { useState } from 'react';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from  "@mui/material/"
import { Button } from "@mui/material/"

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-lg">{question}</span>
        {isOpen ? <ChevronUp className="flex-shrink-0 ml-2" /> : <ChevronDown className="flex-shrink-0 ml-2" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-400 animate-fadeIn">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const HelpFAQPage = () => {
  const faqs = [
    {
      question: "How do I create a custom bot?",
      answer: "To create a custom bot, navigate to the 'Create Custom Bot' section in the sidebar. Follow the step-by-step guide to define your bot's personality, knowledge base, and interaction style. You can customize various parameters to make your bot unique and tailored to your needs."
    },
    {
      question: "What are credits and how do I use them?",
      answer: "Credits are the currency used in Instant Bots to access premium features and bots. You can purchase credits in the 'Credits' section. Use them to interact with premium bots, access advanced features, or create more complex custom bots. Keep an eye on special offers to get the best value for your credits."
    },
    {
      question: "How can I change my account settings?",
      answer: "To modify your account settings, click on the 'Settings' option in the sidebar. Here you can update your email, change your password, adjust notification preferences, manage privacy settings, and customize your user experience. Remember to save your changes before leaving the settings page."
    },
    {
      question: "Is my conversation history saved?",
      answer: "Yes, your conversation history is automatically saved and can be accessed through the 'Chat History' option in the sidebar. You can review past interactions with various bots, search for specific conversations, and even continue old chats. For privacy reasons, you also have the option to delete your chat history."
    },
    {
      question: "How do I report an issue with a bot?",
      answer: "If you encounter an issue with a bot, use the 'Report' button available in each chat interface. Provide as much detail as possible, including the bot's name, the nature of the issue, and any error messages you received. Our support team will investigate and work to resolve the problem promptly. For urgent issues, you can also contact our support team directly."
    }
  ];

  return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Help & FAQ</h1>

          {/* Search bar */}
          <div className="relative mb-12">
            <Input
              type="text"
              placeholder="Search for help..."
            className="w-full bg-gray-800 text-white border-gray-700 rounded-lg py-3 pl-12 pr-4 placeholder-white"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" />
          </div>

          {/* FAQ section */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Contact support */}
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="mb-6 text-gray-400">If you couldn't find the answer you were looking for, our support team is here to assist you.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center w-full sm:w-auto">
              <MessageCircle className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
  );
};

export default HelpFAQPage;