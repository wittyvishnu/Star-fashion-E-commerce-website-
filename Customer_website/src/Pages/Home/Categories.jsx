import React from 'react';
import { Link } from 'react-router-dom';
import sneakers from '../../Utiles/sneakers.png';
import jacket from '../../Utiles/jacket.png';
import hoddie from '../../Utiles/hoddie.png';
import jeans from '../../Utiles/jeans.png';
import watches from '../../Utiles/watches.png';
import swimware from '../../Utiles/swimware.png';
import inners from '../../Utiles/inners.png';
import sunglass from '../../Utiles/sunglass.png';
import footware from '../../Utiles/footware.png';
import suits from '../../Utiles/suits.png';

const Services = () => {
  const categories = [
    {
      id: "69341cdf51889327df5fc9e3",
      name: "SNEAKERS",
      type: "Footwear",
      image: sneakers,
      bgColor: "bg-[#DFF2FA]", 
    },
    {
      id: "69341cdf51889327df5fc9ec",
      name: "JACKETS",
      type: "Clothing",
      image: jacket,
      bgColor: "bg-[#CFD8EB]", 
    },
    {
      id: "69341cdf51889327df5fc9e5",
      name: "HOODIES",
      type: "Clothing",
      image: hoddie,
      bgColor: "bg-[#B3D6D9]", 
    },
    {
      id: "69341cdf51889327df5fc9e4",
      name: "JEANS",
      type: "Clothing",
      image: jeans,
      bgColor: "bg-[#FDECE9]", 
    },
    {
      id: "69341cdf51889327df5fc9e8",
      name: "WATCHES",
      type: "Accessories",
      image: watches,
      bgColor: "bg-[#E3F3E6]", 
    },
    {
      id: "69341cdf51889327df5fc9e6",
      name: "SWIMWEAR",
      type: "Clothing",
      image: swimware,
      bgColor: "bg-[#F3F0FA]", 
    },
    {
      id: "69341cdf51889327df5fc9e7",
      name: "INNERS",
      type: "Clothing",
      image: inners,
      bgColor: "bg-[#CDCDDD]", 
    },
    {
      id: "69341cdf51889327df5fc9ea",
      name: "SUN GLASS",
      type: "Accessories",
      image: sunglass,
      bgColor: "bg-[#DAE7F3]", 
    },
    {
      id: "69341cdf51889327df5fc9eb",
      name: "FLIP FLOP",
      type: "Footwear",
      image: footware,
      bgColor: "bg-[#D9C6B2]", 
    },
    {
      id: "69341cdf51889327df5fc9e9",
      name: "SUITS",
      type: "Clothing",
      image: suits,
      bgColor: "bg-[#E1E3E6]", 
    },
  ];

  return (
    <section className="p-8 sm:p-10 w-full bg-white">
      <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10">

      <h2 className="text-[24px] sm:text-[32px] leading-tight tracking-tight font-poppins font-bold text-blue-900 mb-4">
          Browse With The Category
        </h2>
        <p className="text-sm sm:text-lg text-[#666666] -mt-3">
          Here are some of our popular categories. Explore now!
        </p>
      </div>
      
      {/* Grid Layout Updates:
          - grid-cols-3: Base (Small screens)
          - md:grid-cols-4: Medium screens
          - lg:grid-cols-5: Large screens
      */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-6 mt-4">
        {categories.map((cat) => (
          <Link 
            to={`/products?category=${cat.id}`} 
            key={cat.id}
            className={`rounded-2xl p-2 sm:p-4 transition-transform hover:-translate-y-1 hover:shadow-lg duration-300 ${cat.bgColor}`}
          >
            <div className="flex flex-col h-full">
              <span className="text-[10px] sm:text-sm font-medium text-gray-600 mb-1">
                {cat.type}
              </span>
              
              <h3 className="text-xs sm:text-lg md:text-xl font-black text-gray-700 uppercase mb-2 sm:mb-4 tracking-wide font-sans break-words">
                {cat.name}
              </h3>

              <div className="flex-1 rounded-lg overflow-hidden bg-transparent relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain object-center p-1 sm:p-2 mix-blend-multiply" 
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Services;