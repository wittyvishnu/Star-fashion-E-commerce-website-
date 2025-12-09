import React, { useState } from 'react';
import { Scissors, Plus, X } from 'lucide-react';
import Sidebar from './Sidebar';

const ServicesCustomization = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [services, setServices] = useState([
    { id: 1, name: 'Suit Tailoring', price: 150, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 2, name: 'Dress Alterations', price: 80, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 3, name: 'Pants Hemming', price: 30, image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=300&h=200' },
  ]);

  const [newService, setNewService] = useState({ name: '', price: '', image: '' });

  const handleAddService = () => {
    if (newService.name && newService.price && newService.image) {
      setServices([...services, { ...newService, id: services.length + 1 }]);
      setNewService({ name: '', price: '', image: '' });
    }
  };

  const handleRemoveService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Services Customization</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="dashboard-card mb-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Service Name"
                  className="input-field"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="input-field"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="input-field"
                  value={newService.image}
                  onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                />
              </div>
              <button onClick={handleAddService} className="btn-primary mt-4">
                <Plus className="h-5 w-5 mr-2 inline" />
                Add Service
              </button>
            </div>

            <div className="dashboard-card">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Current Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-gray-600">${service.price}</p>
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="mt-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5 mr-1 inline" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesCustomization;