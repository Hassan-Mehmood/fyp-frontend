"use client"
import React, { useState } from 'react';

const CreditPackage = ({ amount, price, onPurchase }) => (
  <div className="bg-gray-800 rounded-lg p-6 text-white">
    <h3 className="text-xl font-bold mb-2">{amount} Credits</h3>
    <p className="text-2xl font-bold mb-4">${price}</p>
    <button
      onClick={onPurchase}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Purchase
    </button>
  </div>
);

const TransactionHistory = () => {
  const transactions = [
    { date: '2024-09-25', description: 'Credit Purchase', amount: 500, credits: 500 },
    { date: '2024-09-20', description: 'Used for Premium Bot', amount: -50, credits: -50 },
    { date: '2024-09-15', description: 'Credit Purchase', amount: 100, credits: 100 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount ($)</th>
            <th className="px-4 py-2 text-left">Credits</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="px-4 py-2">{transaction.date}</td>
              <td className="px-4 py-2">{transaction.description}</td>
              <td className="px-4 py-2">
                {transaction.amount > 0 ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`}
              </td>
              <td className={`px-4 py-2 ${transaction.credits > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.credits > 0 ? `+${transaction.credits}` : transaction.credits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CreditsPage = () => {
  const [currentCredits, setCurrentCredits] = useState(550);
  const [activeTab, setActiveTab] = useState('buy');

  const handlePurchase = (amount) => {
    // Implement purchase logic here
    setCurrentCredits(currentCredits + amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Credits</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Current Balance</p>
            <p className="text-3xl font-bold text-white">{currentCredits} Credits</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Top Up
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'buy'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('buy')}
          >
            Buy Credits
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === 'history'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
        </div>
      </div>

      {activeTab === 'buy' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CreditPackage amount={100} price={9.99} onPurchase={() => handlePurchase(100)} />
          <CreditPackage amount={500} price={39.99} onPurchase={() => handlePurchase(500)} />
          <CreditPackage amount={1000} price={69.99} onPurchase={() => handlePurchase(1000)} />
        </div>
      ) : (
        <TransactionHistory />
      )}
    </div>
  );
};

export default CreditsPage;