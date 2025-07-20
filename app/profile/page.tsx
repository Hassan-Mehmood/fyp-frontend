import { currentUser } from "@clerk/nextjs/server";
import ProfileClientView from "./ProfileClientView";
import axios from "axios";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="p-8 max-w-6xl mx-auto bg-gray-900">
        <p className="text-white">You must be signed in to view your profile.</p>
      </div>
    );
  }

  // ✅ Extract only serializable properties
  const serializableUser = {
    fullName: user.fullName,
    email: user.emailAddresses[0]?.emailAddress,
    id: user.id,
  };

  const response = await axios.get(`https://fyp-backend-d3ac9a1574db.herokuapp.com/profile/${user.id}`);

  if (response.status !== 200) {
    return (
      <div className="p-8 max-w-6xl mx-auto bg-gray-900">
        <p className="text-white">Failed to load profile.</p>
      </div>
    );
  }

  return <ProfileClientView user={serializableUser} profileData={response.data} />;
}
