'use client';
import { useRouter } from 'next/navigation';
import {
  User,
  CreditCard,
  MessageSquare,
  Bot,
  Settings,
  PlusCircle,
} from "lucide-react";
import EditProfileSection from "./EditProfileSection";

const ProfileSection = ({ icon, title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default function ProfileClientView({ user, profileData }) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-900">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Your Profile</h1>
        <p className="text-xl text-gray-300">
          Manage your account and view your Instant Bots activity
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileSection
            icon={<User size={24} className="text-blue-500" />}
            title="Account Information"
          >
            <p className="text-white"><strong>Name:</strong> {user?.fullName}</p>
            <p className="text-white"><strong>Email:</strong> {user?.emailAddresses?.emailAddress}</p>
            <EditProfileSection />
          </ProfileSection>

          <ProfileSection
            icon={<MessageSquare size={24} className="text-green-500" />}
            title="Chat Activity"
          >
            <p className="text-white"> {/* Add chat summary here if needed */} </p>
            <button
              onClick={() => router.push('/chat-history')}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              View Chat History
            </button>
          </ProfileSection>
        </div>

        <div>
          <ProfileSection
            icon={<CreditCard size={24} className="text-yellow-500" />}
            title="Credits"
          >
            <p className="text-3xl font-bold text-center my-4 text-white">
              {/* {profileData.credits} */}
            </p>
            <button
              onClick={() => router.push('/credits')}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Buy More Credits
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<PlusCircle size={24} className="text-indigo-500" />}
            title="Custom Bots"
          >
            <p className="text-white">Create your own AI companion!</p>
            <button
              onClick={() => router.push('/custom-bot')}
              className="mt-4 w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
            >
              Create Custom Bot
            </button>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
