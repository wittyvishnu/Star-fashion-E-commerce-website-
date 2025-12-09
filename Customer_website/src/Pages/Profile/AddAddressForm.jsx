// AddAddressForm.jsx
import React, { useState, useEffect } from 'react';

// NEW: Define required fields
const REQUIRED_FIELDS = ['fullName', 'street', 'city', 'state', 'zipCode', 'contactPhone', 'email'];

const AddAddressForm = ({ onClose, onSubmit, isCreating }) => {
  // This component now manages its own form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', // Default country
    contactPhone: '',
    alternateContactPhone: '',
  });

  // NEW: State for validation errors
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // NEW: Validation function
  const validateForm = () => {
    const newErrors = {};
    for (const field of REQUIRED_FIELDS) {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // NEW: Handle submit click
  const handleSubmit = () => {
    if (validateForm()) {
      // If valid, call the onSubmit prop from parent
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Address</h2>

        {/* Row: Name & Email */}
        <div className="flex gap-4 mb-3">
          <div className="w-1/2">
            <label className="font-medium block mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              // NEW: Conditional border
              className={`w-full p-4 border rounded ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div className="w-1/2">
            <label className="font-medium block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              // NEW: Conditional border
              className={`w-full p-4 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="mb-3">
          <label className="font-medium block mb-1">Street Address</label>
          <textarea
            name="street"
            placeholder="123 Main St, Apt 4B"
            value={formData.street}
            onChange={handleChange}
            // NEW: Conditional border
            className={`w-full p-4 border rounded ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        {/* Row: City & State */}
        <div className="flex gap-4 mb-3">
          <div className="w-1/2">
            <label className="font-medium block mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Mumbai"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-4 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div className="w-1/2">
            <label className="font-medium block mb-1">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full p-4 border rounded text-gray-600 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select State</option>
              {/* (All your state options) */}
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
              <option value="Daman and Diu">Daman and Diu</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>

        {/* Row: Zip Code & Country */}
        <div className="flex gap-4 mb-3">
          <div className="w-1/2">
            <label className="font-medium block mb-1">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="000000"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full p-4 border rounded ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div className="w-1/2">
            <label className="font-medium block mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-4 border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>

        {/* Row: Contact & Alt Contact */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-medium block mb-1">Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              placeholder="+91 0000 000000"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`w-full p-4 border rounded ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div className="w-1/2">
            <label className="font-medium block mb-1">Alt. Contact (Optional)</label>
            <input
              type="text"
              name="alternateContactPhone"
              placeholder="+91 0000 000000"
              value={formData.alternateContactPhone}
              onChange={handleChange}
              className="w-full p-4 border rounded border-gray-300" // Not required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5">
          <button
            onClick={onClose}
            className="w-[269px] h-[46px] border rounded-xl "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} // NEW: Use new handler
            disabled={isCreating} // NEW: Disable on load
            className="w-[269px] h-[46px] bg-black text-white rounded-xl disabled:opacity-50"
          >
            {isCreating ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressForm;