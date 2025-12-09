import React from "react";
import { Link } from "react-router-dom";

const SignUpButton = () => {
  return (
    <Link
      to="/account"
      className="text-lg text-gray-800 hidden md:block px-4 py-2 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900"
    >
      Sign Up
    </Link>
  );
};

export default SignUpButton;
