import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { MdPerson,MdContactPage,MdSettings,MdNotifications,MdLogout,MdViewInAr      
} from 'react-icons/md';
import Address from './ProfilePage';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
  { label: 'Profile', icon: MdPerson, path: '/profile' },
  { label: 'Orders', icon: MdViewInAr, path: '/orders' },
  { label: 'Saved Address', icon: MdContactPage, path: '/address' },
  { label: 'Settings', icon: MdSettings, path: '/settings' },
  { label: 'Notifications', icon: MdNotifications, path: '/notifications' },
  { label: 'Log Out', icon: MdLogout, path: '/logout', danger: true }
];

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-black text-white rounded-full hover:bg-blue-700 transition"
      >
        <FaUser size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center w-full px-4 py-2 text-sm transition ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">
  <item.icon size={20} />
</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
