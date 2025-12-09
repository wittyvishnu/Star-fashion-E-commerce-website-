import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
//import email from '../../Utiles/email.png';

function Footer() {
  return (
<footer className="bg-[#000000D1] text-white h-[400px] max-w-[1440px] mx-auto py-[34px] px-[24px] opacity-100">
  <div className="container mx-auto">
    <div className="flex flex-nowrap justify-start gap-[134px] space-y-28">
      
      {/* Sign Up and Save Section flex flex-col*/}
      <div className="w-[220.39px] h-[278px] flex flex-col mt-12 ">
        {/* Heading */}
        <h2 className="text-[14px] font-normal font-[Lexend] mb-[24px] leading-[100%] text-white">
          SIGN UP AND SAVE
        </h2>
        {/* Paragraph */}
        <p className="text-[14px] font-normal font-[Lexend] leading-[150%] mb-[24px] text-white">
          Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
        </p>

        {/* Email Input */}
        <form className="flex items-center justify-between border-b-2 border-white w-[186px] py-[6px] mb-[24px]">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full bg-transparent text-[14px] placeholder-gray-300 focus:outline-none"
          />
          <button type="submit" className="flex-shrink-0 ml-2">
            <img
              src = "{email}"
              alt="submit"
              className="w-[18px] h-[16px] bg-white opacity-100"
            />
          </button>
        </form>

        {/* Social Icons */}
        <div className="flex space-x-6 justify-start">
          <a href="#" className="hover:text-gray-400"><FaInstagram size={20} /></a>
          <a href="#" className="hover:text-gray-400"><FaFacebookF size={20} /></a>
          <a href="#" className="hover:text-gray-400"><FaTwitter size={20} /></a>
        </div>
      </div>

          {/* Location Section */}
          <div className="w-[189.42px] h-[211.61px]">
            <h3 className="font-semibold text-sm mb-3">LOCATION</h3>
            <ul className="text-xs leading-relaxed space-y-4">
              <li>007, James Bond Street,<br />London, England.</li>
              <li>Mon-Sat 10AM - 9PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>

          {/* About Section */}
          <div className="w-[132.24px] h-[188.1px]">
            <h3 className="font-Lexend text-sm mb-3">About</h3>
            <ul className="text-xs space-y-4">
              <li>FAQ</li>  
              <li>Services</li>
              <li>Contact</li>
              <li>Start a Return or <br/>Exchange</li>
            </ul>
          </div>

          {/* FAQ Section */}
          <div className="w-[146.77px] h-[128.63px] ">
           {/* <h3 className="font-semibold text-sm mb-4">FAQ</h3>*/}
            <ul className="text-xs space-y-4">
              <li>Tailoring</li>
              <li>Made-to-Measure</li>
              <li>Weddings</li>
              <li>Made-to-Order</li>
            </ul>
          </div>

          {/* Policies Section */}
          <div className="w-full md:w-1/5">
           {/*  <h3 className="font-semibold text-sm mb-3">POLICIES</h3>*/}
            <ul className="text-xs space-y-4">
              <li>Orders</li>
              <li>Returns</li>
              <li>Terms and Conditions</li>
              <li>Privacy and Policy</li>
              <li>Gifts</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom 
        <p className="text-center mt-10 text-gray-500 text-xs">
          © 2024 StarFashion. All rights reserved.
        </p>*/}
      </div>
    </footer>
  );
}

export default Footer;
