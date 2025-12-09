// ProfileInfo.jsx
import React, { useEffect, useState } from "react";
// 1. Import the new hooks from your new profileSlice
import { useGetProfileQuery, useUpdateProfileMutation } from "../../redux/services/profileSlice";

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "", // Added phone field
  });

  // 2. Use the new query. No userId needed; token is used automatically.
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();

  // 3. Populate state when data loads
  useEffect(() => {
    if (profileData?.user) {
      setProfile({
        name: profileData.user.name || "",
        email: profileData.user.email || "",
        phone: profileData.user.phone || "",
      });
    }
  }, [profileData]);

  // 4. Use the new update mutation
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    // 5. Send a simple JSON object, not FormData
    const updatedData = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    };

    try {
      const res = await updateProfile(updatedData).unwrap();
      console.log("Profile updated:", res);
      setIsEditing(false);
      // refetch() is no longer strictly needed if you update authSlice,
      // but it ensures this component's data is fresh.
      refetch(); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e, field) => {
    setProfile({
      ...profile,
      [field]: e.target.value,
    });
  };

  // 6. Removed handleImageChange logic

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-sky-100 text-gray-700 p-8">
      <div className="container mx-auto px-10 space-y-8">
        
        {/* 7. Removed Image display and file input */}

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-black">Profile Info</h2>

          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange(e, "name")}
            readOnly={!isEditing}
            placeholder="Name"
            className={`p-3 w-full rounded-lg border ${
              isEditing ? "border-gray-600" : "bg-gray-200"
            }`}
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange(e, "email")}
            readOnly={!isEditing}
            placeholder="Email"
            className={`p-3 w-full rounded-lg border ${
              isEditing ? "border-gray-600" : "bg-gray-200"
            }`}
          />

          {/* 8. Added Phone input field */}
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleChange(e, "phone")}
            readOnly={!isEditing}
            placeholder="Phone Number"
            className={`p-3 w-full rounded-lg border ${
              isEditing ? "border-gray-600" : "bg-gray-200"
            }`}
          />

          {/* Edit / Save Button */}
          <div className="flex space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="text-green-500 hover:text-green-700 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;