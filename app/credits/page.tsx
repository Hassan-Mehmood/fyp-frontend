"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

// Types for better TypeScript support
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  credits: number;
  type: 'purchase' | 'usage';
}

interface UserCredits {
  credits: number;
  transactions?: Transaction[];
}

const CreditPackage = ({ 
  amount, 
  price, 
  onPurchase, 
  isLoading 
}: { 
  amount: number; 
  price: number; 
  onPurchase: () => void; 
  isLoading: boolean;
}) => (
  <div className="bg-gray-800 rounded-lg p-6 text-white">
    <h3 className="text-xl font-bold mb-2">{amount} Credits</h3>
    <p className="text-2xl font-bold mb-4">${price}</p>
    <button
      onClick={onPurchase}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      {isLoading ? 'Processing...' : 'Purchase'}
    </button>
  </div>
);

const TransactionHistory = ({ transactions, isLoading }: { transactions: Transaction[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-white">Loading transactions...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white rounded-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Amount ($)</th>
            <th className="px-4 py-3 text-left">Credits</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-700">
              <td className="px-4 py-3">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{transaction.description}</td>
              <td className="px-4 py-3">
                {transaction.amount > 0
                  ? `+$${transaction.amount.toFixed(2)}`
                  : `-$${Math.abs(transaction.amount).toFixed(2)}`}
              </td>
              <td
                className={`px-4 py-3 ${
                  transaction.credits > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {transaction.credits > 0
                  ? `+${transaction.credits}`
                  : transaction.credits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CreditsPage = () => {
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("buy");
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const user_id = user?.id;

  const API_BASE_URL = "https://fyp-backend-d3ac9a1574db.herokuapp.com";

  const fetchUserCredits = async () => {
    if (!user_id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/users/credits/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

       const transactionsResponse = await axios.get(`${API_BASE_URL}/users/transaction-history/${user_id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: UserCredits = await response.data;
      const transactionsDataRaw = transactionsResponse.data.transaction_history;

const transactionsData: Transaction[] = transactionsDataRaw.map((txn: any) => ({
  id: txn.id,
  date: txn.date,
  description: txn.type === 'PURCHASE' ? 'Credit Purchase' : 'Usage',
  amount: txn.amount,
  credits: txn.type === 'PURCHASE' ? txn.amount : -txn.amount,
  type: txn.type.toLowerCase(), // 'purchase' | 'usage'
}));

     setCurrentCredits(data.credits);

      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching user credits:', error);
      setError('Failed to load credits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchUserCredits();
    }
  }, [user_id]);

  const handlePaymentSuccess = async (amount: number) => {
    try {
      await fetchUserCredits();
      
      // Optionally show a success message
      console.log(`Successfully purchased ${amount} credits!`);
    } catch (error) {
      console.error('Error refreshing credits after payment:', error);
    }
  };

  const handlePurchase = async (creditAmount: number, price: number) => {
    if (!user_id) {
      setError('Please log in to purchase credits');
      return;
    }

    try {
      setIsPurchasing(true);
      setError(null);
      
      console.log("Creating checkout session for:", { creditAmount, price, user_id });

      const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: creditAmount, 
          price: price,
          user_id 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { session_id } = await response.json();
      
      if (!session_id) {
        throw new Error('No session ID returned from server');
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Stripe.js has not loaded properly.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: session_id });
      
      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Error during purchase:', error);
      setError(error instanceof Error ? error.message : 'Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const refreshCredits = async () => {
    await fetchUserCredits();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6 text-center text-white">
          Please log in to view your credits.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Credits</h1>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Current Balance Card */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Current Balance</p>
            <p className="text-3xl font-bold text-white">
              {isLoading ? 'Loading...' : `${currentCredits} Credits`}
            </p>
          </div>
          <button 
            onClick={refreshCredits}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === "buy"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("buy")}
          >
            Buy Credits
          </button>
          <button
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === "history"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "buy" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CreditPackage
            amount={100}
            price={2.5}
            onPurchase={() => handlePurchase(100, 2.5)}
            isLoading={isPurchasing}
          />
          <CreditPackage
            amount={500}
            price={5.0}
            onPurchase={() => handlePurchase(500, 5.0)}
            isLoading={isPurchasing}
          />
          <CreditPackage
            amount={1000}
            price={10.0}
            onPurchase={() => handlePurchase(1000, 10.0)}
            isLoading={isPurchasing}
          />
        </div>
      ) : (
        <TransactionHistory transactions={transactions} isLoading={isLoading} />
      )}
    </div>
  );
};

export default CreditsPage;