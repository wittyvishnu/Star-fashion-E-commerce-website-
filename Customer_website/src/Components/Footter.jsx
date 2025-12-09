import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import email from '../Utiles/email.png';
import { MdEmail } from 'react-icons/md';

function Footter() {
  return (
    <footer className="bg-[#000000D1] text-white max-w-[1440px] mx-auto py-[34px] px-[24px]">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-10 gap-y-10 items-start">
        
        {/* Sign Up and Save Section */}
        <div className="flex flex-col gap-y-6">
          <h2 className="text-sm font-[Lexend] leading-tight">SIGN UP AND SAVE</h2>
          <p className="text-sm font-[Lexend] leading-relaxed">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          <form className="flex items-center border-b-2 border-white py-1 w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full bg-transparent text-sm placeholder-gray-300 focus:outline-none"
            />
            <button type="submit" className="ml-2">
             <MdEmail className="w-5 h-4 text-white opacity-100" />
            </button>
          </form>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaFacebookF size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaTwitter size={20} /></a>
          </div>
        </div>

        {/* Location Section */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-sm font-semibold">LOCATION</h3>
          <ul className="text-xs space-y-2">
            <li>007, James Bond Street,<br />London, England.</li>
            <li>Mon-Sat 10AM - 9PM</li>
            <li>Sun: Closed</li>
          </ul>
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-sm font-[Lexend]">About</h3>
          <ul className="text-xs space-y-2">
            <li>FAQ</li>  
            <li>Services</li>
            <li>Contact</li>
            <li>Start a Return or <br />Exchange</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-sm font-semibold">Tailoring</h3>
          <ul className="text-xs space-y-2">
            <li>Made-to-Measure</li>
            <li>Weddings</li>
            <li>Made-to-Order</li>
          </ul>
        </div>

        {/* Policies Section */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-sm font-semibold">POLICIES</h3>
          <ul className="text-xs space-y-2">
            <li>Orders</li>
            <li>Returns</li>
            <li>Terms and Conditions</li>
            <li>Privacy and Policy</li>
            <li>Gifts</li>
            <li>Refund Policy</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      {/* <p className="text-center mt-10 text-gray-500 text-xs">
        © 2024 StarFashion. All rights reserved.
      </p> */}
    </footer>
  );
}

export default Footter;
