import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';
import AddAddressForm from './AddAddressForm';
import EditAddressModal from './EditAddressModal';

import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../../redux/services/addressSlice'; 

const SavedAddress = () => {
  const { data: addressData, isLoading, error } = useGetAddressesQuery({ page: 1, limit: 10 });
  const addresses = addressData?.addresses || [];

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [menuOpen, setMenuOpen] = useState(null); 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id).unwrap();
      setMenuOpen(null); 
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id).unwrap();
      setMenuOpen(null); 
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleEditClick = (addr) => {
    setEditData(addr); 
    setEditModalOpen(true);
    setMenuOpen(null); 
  };

  const handleEditSave = async (updatedFormData) => {
    if (!editData?.id) return;

    try {
      await updateAddress({ id: editData.id, ...updatedFormData }).unwrap();
      setEditModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await createAddress(formData).unwrap();
      setAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const filteredAddresses = addresses.filter((addr) =>
    (addr.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (addr.street || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // RESPONSIVE: Changed p-6 to p-4 md:p-6 for better mobile spacing
    <div className="relative max-w-4xl mx-auto p-4 md:p-6 bg-white rounded shadow">
      
      <button
        onClick={() => navigate('/')}
        className="text-gray-800 hover:text-blue-600 text-sm font-medium flex items-center mb-4"
      >
        &lt; Shopping Continue
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Saved Address</h2>
        <p className="text-sm text-gray-600 mb-4">You have {addresses.length} saved address</p>

        {/* RESPONSIVE: Flex-col for mobile, Row for SM+ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-full sm:max-w-xs md:max-w-md">
            <FiSearch className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
              autoComplete="off" 
            />
          </div>

          {/* Add New Button - RESPONSIVE SIZE */}
          <button
            onClick={() => {
              setAddModalOpen(true);
            }}
            // Changes: 
            // 1. w-full sm:w-auto (Full width on mobile, auto on desktop)
            // 2. px-6 (Reduced from px-8)
            // 3. text-sm (Smaller text)
            className="bg-black text-white w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-full hover:bg-gray-800 transition text-sm sm:text-base font-medium"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-4">Loading addresses...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-4">Failed to load addresses.</p>
        ) : (
          filteredAddresses.map((addr) => (
            <div key={addr.id} className="border border-gray-300 rounded p-4 relative hover:shadow-sm transition-shadow">
              {/* RESPONSIVE: Added gap to prevent overlap on tiny screens */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0"> {/* min-w-0 allows text truncation if needed */}
                  <h3 className="font-semibold text-gray-800 break-words">{addr.fullName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{addr.contactPhone}</p>
                  <p className="text-sm text-gray-600 break-words leading-relaxed">
                    {addr.street}
                    {addr.city && `, ${addr.city}`}
                    {addr.state && `, ${addr.state}`}
                    {addr.zipCode && `, ${addr.zipCode}`}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-medium">
                      Default
                    </span>
                  )}
                </div>

                <div className="relative flex-shrink-0">
                  <button 
                    onClick={() => setMenuOpen(menuOpen === addr.id ? null : addr.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMoreVertical size={20} className="text-gray-600" />
                  </button>

                  {menuOpen === addr.id && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20">
                      {!addr.isDefault && (
                        <li
                          onClick={() => handleSetDefault(addr.id)}
                          className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          Set as default
                        </li>
                      )}
                      <li
                        onClick={() => handleEditClick(addr)}
                        className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        Edit address
                      </li>
                      <li
                        onClick={() => handleDelete(addr.id)}
                        className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        Delete
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {editModalOpen && (
        <EditAddressModal
          editData={editData} 
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave} 
          isUpdating={isUpdating} 
        />
      )}

      {addModalOpen && (
        <AddAddressForm
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddSubmit} 
          isCreating={isCreating} 
        />
      )}
    </div>
  );
};

export default SavedAddress;