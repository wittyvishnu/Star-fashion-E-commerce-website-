import React, { useState } from "react";
import { useUpdateUserMutation } from "../../redux/services/userSlice"; // Import the mutation hook

const Address = ({ userId, existingAddresses = [] }) => {
  const [addresses, setAddresses] = useState(existingAddresses);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [updateUser] = useUpdateUserMutation(); // Use mutation for updating user profile

  // Handle adding a new address
  const handleAddAddress = async () => {
    if (Object.values(newAddress).some((field) => field.trim() === "")) {
      alert("Please fill out all fields.");
      return;
    }

    const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updatedAddresses);
    setNewAddress({
      fullName: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
    setIsAdding(false);

    // Send update request to backend
    await updateUser({ userId, data: { address: updatedAddresses } });
  };

  // Handle editing an address
  const handleSaveEdit = async () => {
    const updatedAddresses = addresses.map((address) =>
      address.id === editingId ? { ...newAddress, id: editingId } : address
    );

    setAddresses(updatedAddresses);
    setNewAddress({
      fullName: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
    setIsEditing(false);

    // Send update request to backend
    await updateUser({ userId, data: { address: updatedAddresses } });
  };

  // Handle deleting an address
  const handleDeleteAddress = async (id) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);

    // Send update request to backend
    await updateUser({ userId, data: { address: updatedAddresses } });
  };

  // Handle editing an address
  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((address) => address.id === id);
    setNewAddress({ ...addressToEdit });
    setIsAdding(true);
    setIsEditing(true);
    setEditingId(id);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="container mx-auto space-y-8">
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 text-white p-3 rounded-lg"
          >
            Add New Address
          </button>
        )}

        {/* Address Form */}
        {(isAdding || isEditing) && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-4">
            <h2 className="text-2xl font-semibold text-black">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />
              <input
                type="text"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={newAddress.zipCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zipCode: e.target.value })
                }
                className="p-3 w-full rounded-lg text-gray-800"
              />

              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-500 text-white p-3 w-full rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setIsAdding(false);
                      }}
                      className="bg-gray-500 text-white p-3 w-full rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddAddress}
                      className="bg-blue-500 text-white p-3 w-full rounded-lg"
                    >
                      Add Address
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="bg-gray-500 text-white p-3 w-full rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Display Addresses */}
        <div className="space-y-4 mt-8">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{address.fullName}</h3>
              <p>{address.street}, {address.city}, {address.state}, {address.country}</p>
              <p>Zip Code: {address.zipCode}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEditAddress(address.id)}
                  className="bg-yellow-500 text-white p-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Address;
