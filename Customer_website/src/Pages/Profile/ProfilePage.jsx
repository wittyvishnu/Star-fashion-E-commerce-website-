// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdArrowBack } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

// 1. Import the RTK Query hooks
import { useGetProfileQuery, useUpdateProfileMutation } from "../../redux/services/profileSlice"; // Adjust path if needed

const ProfilePage = () => {
  // 2. State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  // Gender state is removed
  
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 3. Use the hooks to fetch and update data
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // 4. Populate form state when API data loads
  useEffect(() => {
    if (profileData?.user) {
      setName(profileData.user.name || '');
      setEmail(profileData.user.email || '');
      setMobile(profileData.user.phone || ''); // Map 'phone' from API to 'mobile' state
    }
  }, [profileData]);

  // 5. Update handleSave to call the API mutation
  const handleSave = async () => {
    const updatedData = {
      name,
      email,
      phone: mobile, // Map 'mobile' state back to 'phone' for the API
    };

    try {
      await updateProfile(updatedData).unwrap();
      setIsEditing(false);
      // refetch(); // Optional: refetch to confirm data (authSlice should also update)
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // 6. Update handleCancel to revert changes
  const handleCancel = () => {
    // Revert to original data from the query
    if (profileData?.user) {
      setName(profileData.user.name || '');
      setEmail(profileData.user.email || '');
      setMobile(profileData.user.phone || '');
    }
    setIsEditing(false);
  };

  // 7. Add a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-xl font-semibold text-gray-800 hover:text-blue-600 transition"
        >
          <MdArrowBack className="mr-1" size={20} />
          Shopping Continue
        </button>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-black hover:text-blue-800 flex items-center"
          >
            <MdEdit className="mr-2" size={20} />
            Edit
          </button>
        )}
      </div>

      {/* User Icon and Info - Now shows data from API */}
      <div className="flex items-center gap-4 mb-6">
        <FaUserCircle size={40} className="text-gray-500" />
        <div>
          <p className="text-lg font-semibold text-gray-800">{name || 'Your name'}</p>
          <p className="text-sm text-gray-500">{email || 'yourname@gmail.com'}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 text-gray-700">
        <div>
          <label className="font-medium block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={!isEditing}
            className={`w-full border rounded px-3 py-2 ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing}
            className={`w-full border rounded px-3 py-2 ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Mobile number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            readOnly={!isEditing}
            className={`w-full border rounded px-3 py-2 ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
          />
        </div>
        
        {/* 8. Gender field is now removed */}

      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-center gap-10 pt-6">
          <button
            onClick={handleCancel}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating} // Disable button while saving
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;