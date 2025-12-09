import React from "react";
import { FaHome, FaUserCircle, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      {/* Sidebar Content */}
      <div className="fixed top-0 left-0 w-64 h-full bg-blue-800 text-white z-20">
        <div className="flex justify-between items-center p-4">
        <Link to="/profilepage">My Profile</Link>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-10">
          <Link
            to="/"
            className="text-white text-lg hover:text-blue-100"
          >
            <FaHome className="mr-2 inline" /> Home
          </Link>
          <Link
            to="/products"
            className="text-white text-lg hover:text-blue-100"
          >
            <FaShoppingCart className="mr-2 inline" /> Products
          </Link>
          <Link
            to="/contact"
            className="text-white text-lg hover:text-blue-100"
          >
            Contact
          </Link>
          <Link
            to="/profilepage"
            className="text-white text-lg hover:text-blue-100"
          >
            <FaUserCircle className="mr-2 inline" /> My Orders
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
