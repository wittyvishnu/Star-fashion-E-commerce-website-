import React from 'react';
import { MapPin } from 'lucide-react';

const LocationInfo = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Location Information</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-center h-48 bg-green-200 rounded-lg">
          <MapPin className="w-12 h-12 text-red-600" />
          <span className="ml-2 text-green-800 font-semibold">Map Placeholder</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
            Building / House No.
          </label>
          <input type="text" id="building" name="building" className="input-field" required />
        </div>
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Street / Road
          </label>
          <input type="text" id="street" name="street" className="input-field" required />
        </div>
        <div>
          <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
            Landmark
          </label>
          <input type="text" id="landmark" name="landmark" className="input-field" />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input type="text" id="city" name="city" className="input-field" required />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input type="text" id="state" name="state" className="input-field" required />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <input type="text" id="pincode" name="pincode" className="input-field" required />
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;