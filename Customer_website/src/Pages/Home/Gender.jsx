import React from 'react';
import { Link } from 'react-router-dom';
import picture1 from '../../Utiles/picture1.png';
import picture2 from '../../Utiles/picture2.png';
import picture3 from '../../Utiles/picture3.png';

const Products = () => {
  return (
    <section id="products" className="p-4 sm:p-16 bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-[24px] sm:text-[32px] leading-tight tracking-tight font-poppins font-bold text-blue-900 mb-4">
          Browse With The Gender
        </h2>
        <p className="text-sm sm:text-lg text-[#666666] -mt-3">
          Checkout Top Trending Products
        </p>

        {/* Changed from Flex to Grid-cols-3 to enforce 3 in a row on all screens */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-6 mt-4">
          
          {/* Male */}
          <Link to="/products?gender=male">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture1}
                alt="Male"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-2 sm:mt-4 text-sm sm:text-base">Male</p>
            </div>
          </Link>

          {/* Female */}
          <Link to="/products?gender=female">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture2}
                alt="Female"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-2 sm:mt-4 text-sm sm:text-base">Female</p>
            </div>
          </Link>

          {/* Kids */}
          <Link to="/products?gender=kids">
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src={picture3}
                alt="Kids"
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <p className="text-center text-blue-900 font-semibold mt-2 sm:mt-4 text-sm sm:text-base">Kids</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;