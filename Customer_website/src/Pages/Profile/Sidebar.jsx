import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {onAuthStateChanged, signOut} from 'firebase/auth'
import {auth} from '../../firebase.config'
import { useSelector } from 'react-redux';

const Sidebar = ({ setActiveSection, handleLogout }) => {
  const navigate = useNavigate();
  const {userInfo} = useSelector(action =>action.auth)
  console.log(userInfo);
  
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // useEffect(() => {
  //  if (!userInfo) {
  //   navigate('/account')
  //  }
  // }, [userInfo]);


  handleLogout =async ()=>{
    try {
     await signOut(auth)
     navigate('/account')
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-64 bg-blue-500 text-white p-6 space-y-6 fixed top-0 left-0 bottom-0">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => setActiveSection('profileInfo')}
            className="text-lg hover:text-blue-400 transition-all"
          >
            Profile Info
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveSection('orders')}
            className="text-lg hover:text-blue-400 transition-all"
          >
            My Orders
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveSection('address')}
            className="text-lg hover:text-blue-400 transition-all"
          >
            Address
          </button>
        </li>
      </ul>

      <div className="mt-auto space-y-4">
        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition-all"
        >
          Go Back
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
