import {
  User,
  CreditCard,
  MessageSquare,
  Bot,
  Settings,
  PlusCircle,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import EditProfileSection from "./EditProfileSection";
import axios from "axios";

const ProfileSection = ({ icon, title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="p-8 max-w-6xl mx-auto bg-gray-900">
        <p className="text-white">You must be signed in to view your profile.</p>
      </div>
    );
  }

  const response = await axios.get(`http://127.0.0.1:8000/profile/${user?.id}`);

  if (response.status !== 200) {
    return (
      <div className="p-8 max-w-6xl mx-auto bg-gray-900">
        <p className="text-white">Failed to load chat history.</p>
      </div>
    );
  }

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
            <p className="text-white">
              <strong>Name:</strong> {user?.fullName}
            </p>
            <p className="text-white">
              <strong>Email:</strong>{" "}
              {user?.emailAddresses[0].emailAddress}
            </p>

            {/* ✅ Client Component for edit button */}
            <EditProfileSection />
          </ProfileSection>

          <ProfileSection
            icon={<MessageSquare size={24} className="text-green-500" />}
            title="Chat Activity"
          >
            <p className="text-white">
              {/* You've had {user.totalChats} conversations with our bots. */}
            </p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
              View Chat History
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<Bot size={24} className="text-purple-500" />}
            title="Favorite Bots"
          >
            <ul className="list-disc list-inside text-white">
              {/* Your favorite bots */}
            </ul>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300">
              Manage Favorites
            </button>
          </ProfileSection>
        </div>

        <div>
          <ProfileSection
            icon={<CreditCard size={24} className="text-yellow-500" />}
            title="Credits"
          >
            <p className="text-3xl font-bold text-center my-4 text-white">
              {/* {user.credits} */}
            </p>
            <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300">
              Buy More Credits
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<PlusCircle size={24} className="text-indigo-500" />}
            title="Custom Bots"
          >
            <p className="text-white">Create your own AI companion!</p>
            <button className="mt-4 w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300">
              Create Custom Bot
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<Settings size={24} className="text-gray-500" />}
            title="Settings"
          >
            <button className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">
              Manage Settings
            </button>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
