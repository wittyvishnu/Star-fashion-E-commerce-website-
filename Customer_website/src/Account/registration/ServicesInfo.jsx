import React, { useState } from 'react';
import { Search, Scissors, Shirt, Ruler } from 'lucide-react';

const services = [
  { id: 1, name: 'Suit Tailoring', icon: Shirt, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 2, name: 'Dress Alterations', icon: Scissors, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 3, name: 'Custom Shirts', icon: Ruler, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 4, name: 'Pants Hemming', icon: Scissors, image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 5, name: 'Wedding Dress Tailoring', icon: Shirt, image: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 6, name: 'Leather Alterations', icon: Scissors, image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=300&h=200' },
];

const ServicesInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Select Your Services</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search services..."
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              selectedServices.includes(service.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleService(service.id)}
          >
            <img src={service.image} alt={service.name} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center text-white">
                <service.icon className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-semibold">{service.name}</h3>
              </div>
            </div>
            {selectedServices.includes(service.id) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Scissors className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesInfo;