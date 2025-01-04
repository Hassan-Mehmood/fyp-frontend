"use client";
import { useState } from 'react';
import { Settings, Bell, Shield, CreditCard, Moon, HelpCircle } from 'lucide-react';
import Switch from '@mui/material/Switch';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex-1 p-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <Settings className="mr-2" /> Account Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="dark:text-gray-300">Email</span>
              <input
                type="email"
                className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="dark:text-gray-300">Password</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <Bell className="mr-2" /> Notifications
          </h2>
          <div className="flex items-center justify-between">
            <span className="dark:text-gray-300">Enable Notifications</span>
            <Switch checked={notifications} onChange={() => setNotifications(!notifications)} />
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <Shield className="mr-2" /> Privacy
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="data-collection" className="mr-2" />
              <label htmlFor="data-collection" className="dark:text-gray-300">
                Allow data collection for personalization
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="third-party" className="mr-2" />
              <label htmlFor="third-party" className="dark:text-gray-300">
                Share data with third parties
              </label>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Payment */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <CreditCard className="mr-2" /> Payment Methods
          </h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Add Payment Method
          </button>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <Moon className="mr-2" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="dark:text-gray-300">Dark Mode</span>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Help & Support */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
            <HelpCircle className="mr-2" /> Help & Support
          </h2>
          <div className="space-y-2">
            <button className="text-blue-500 hover:underline dark:text-blue-400">FAQ</button>
            <button className="text-blue-500 hover:underline dark:text-blue-400">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
