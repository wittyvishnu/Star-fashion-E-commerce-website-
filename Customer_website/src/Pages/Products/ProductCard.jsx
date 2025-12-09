import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductCard = ({ product, quantity, onQuantityChange, onInitialAddToCart }) => {

  const handleInitialClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onInitialAddToCart(product._id);
  };

  const handleChange = (e, amount) => {
    e.stopPropagation();
    e.preventDefault();
    const newQuantity = quantity + amount;
    onQuantityChange(product._id, newQuantity);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      // Removed max-w-xs to let it fill the grid cell on mobile
      className="w-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Image - Aspect Ratio Container */}
      <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden group">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info & Actions */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="font-bold text-gray-900 text-sm sm:text-base">
            ₹{product.price}
          </p>
          
          {/* Cart Actions */}
          <div className="flex-shrink-0 ml-2">
            {quantity === 0 ? (
              <button
                onClick={handleInitialClick}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                aria-label="Add to cart"
              >
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <div className="flex items-center bg-blue-50 rounded-full border border-blue-100">
                <button
                  onClick={(e) => handleChange(e, -1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-4 sm:w-6 text-center text-xs sm:text-sm font-semibold text-blue-900">
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleChange(e, 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;