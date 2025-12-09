import React from 'react';
import { Link } from 'react-router-dom';
import showcase from '../../Utiles/banner1.png'; // Ensure path is correct

const Showcase = () => {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-gray-200">
      
      {/* Background Image */}
      <img 
        src={showcase} 
        alt="Showcase Banner" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Content Overlay Container */}
      {/* - flex items-center: Vertically centers the card.
          - justify-center: Horizontally centers the card on Mobile/Small screens.
          - lg:justify-end: Moves card to the right on Large screens.
          - lg:pr-32: Adds spacing from the right edge on Large screens.
      */}
      <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-32 px-4 sm:px-6">
        
        {/* Glass Card */}
        {/* - bg-slate-500/10: Very transparent background (reduced opacity).
            - backdrop-blur-sm: Reduced blur effect (was md).
            - border-white/20: Subtle border.
        */}
        <div className="relative w-full max-w-xs sm:max-w-md bg-slate-500/10 backdrop-blur-sm border border-white/20 rounded-[30px] p-8 sm:p-10 shadow-2xl text-left">
          
          {/* New Arrival Label */}
          <p className="text-gray-800 font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-3">
            New Arrival
          </p>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] leading-[1.15] mb-3 sm:mb-4 font-poppins">
            Discover Our <br />
            New Collection
          </h2>

          {/* Subtext */}
          <p className="text-gray-800 font-medium text-sm sm:text-base mb-6 sm:mb-8">
            50% off to New Customers
          </p>

          {/* Buy Now Button */}
          <Link to="/products">
            <button className="bg-[#0f172a] text-white text-xs sm:text-sm font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-sm hover:bg-blue-900 transition-colors tracking-wider uppercase shadow-md">
              Buy Now
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};  

export default Showcase;