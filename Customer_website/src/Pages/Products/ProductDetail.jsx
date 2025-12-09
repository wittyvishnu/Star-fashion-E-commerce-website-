import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductSuggestionsQuery } from '../../redux/services/productSlice';
import { useAddOrUpdateItemMutation, useDeleteItemMutation } from '../../redux/services/cartSlice'; 
import ProductCard from './ProductCard';
import { FaStar } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";

const ProductDetail = () => {
  const { productId } = useParams();
  
  // --- 1. Queries ---
  const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(productId);
  const product = productData?.data;

  const { data: suggestionsData, isLoading: suggestionsLoading, isError: suggestionsError } = useGetProductSuggestionsQuery({ 
    productId,
    params: { limit: 4 }
  });

  // --- 2. Mutations ---
  const [addOrUpdateItem, { isLoading: isUpdatingCart }] = useAddOrUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  // --- 3. Main Product State ---
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // --- 4. Suggestions State (New) ---
  const [suggestionQuantities, setSuggestionQuantities] = useState({});
  const suggestionDebounceTimers = useRef({});

  // --- 5. Effect: Main Product ---
  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
      setQuantity(product.cart > 0 ? product.cart : 1);
      setIsInCart(product.cart > 0);
      setIsExpanded(false);
    }
  }, [product]); 

  // --- 6. Effect: Suggestions Data ---
  useEffect(() => {
    if (suggestionsData?.data) {
      const newQuantities = {};
      suggestionsData.data.forEach(p => {
        if (p.cart > 0) {
          newQuantities[p._id] = p.cart;
        }
      });
      // Merge with existing quantities
      setSuggestionQuantities(prev => ({ ...prev, ...newQuantities }));
    }
  }, [suggestionsData]);

  // --- 7. Main Product Handlers ---
  const debounceTimer = useRef(null);
  const debouncedUpdateCart = useCallback(async (pid, qty) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        await addOrUpdateItem({ productId: pid, quantity: qty }).unwrap();
        setIsInCart(true); 
      } catch (err) {
        console.error("Failed to update cart:", err);
      }
    }, 1500); 
  }, [addOrUpdateItem]);

  const allImages = product ? [product.thumbnail, ...product.otherImages] : [];

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };
  
  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };
  
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQuantity = Math.max(1, prev + amount);
      if (isInCart) debouncedUpdateCart(product._id, newQuantity);
      return newQuantity;
    });
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      await addOrUpdateItem({ productId: product._id, quantity }).unwrap();
      setIsInCart(true); 
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on StarFashion!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('Error sharing:', err); }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      } catch (err) {
        alert("Failed to copy URL");
      }
    }
  };

  // --- 8. Suggestions Handlers (New) ---
  const handleSuggestionInitialAddToCart = (pid) => {
    const newQuantity = 1;
    setSuggestionQuantities(prev => ({ ...prev, [pid]: newQuantity }));
    addOrUpdateItem({ productId: pid, quantity: newQuantity })
      .unwrap()
      .catch(() => setSuggestionQuantities(prev => ({ ...prev, [pid]: 0 })));
  };

  const handleSuggestionQuantityChange = (pid, newQuantity) => {
    if (newQuantity < 0) return;
    const oldQuantity = suggestionQuantities[pid] || 0;
    
    // Optimistic Update
    setSuggestionQuantities(prev => ({ ...prev, [pid]: newQuantity }));

    if (suggestionDebounceTimers.current[pid]) {
      clearTimeout(suggestionDebounceTimers.current[pid]);
    }

    if (newQuantity === 0) {
      deleteItem(pid).unwrap().catch(() => {
        setSuggestionQuantities(prev => ({ ...prev, [pid]: oldQuantity }));
      });
    } else {
      suggestionDebounceTimers.current[pid] = setTimeout(() => {
        addOrUpdateItem({ productId: pid, quantity: newQuantity }).unwrap()
          .catch(() => {
            setSuggestionQuantities(prev => ({ ...prev, [pid]: oldQuantity }));
          });
      }, 3000);
    }
  };

  // --- Render ---

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error fetching product.</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Product not found.</div>;

  const CHAR_LIMIT = 180;
  const isLongDescription = product.description.length > CHAR_LIMIT;
  const displayText = isLongDescription && !isExpanded 
    ? `${product.description.substring(0, CHAR_LIMIT)}...` 
    : product.description;

  let buttonText;
  if (isUpdatingCart) {
    buttonText = isInCart ? "Updating..." : "Adding...";
  } else {
    buttonText = isInCart ? "Update Cart" : "Add To Cart";
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-16 font-sans">
      <Link
  to="/products"
  className="flex items-center gap-1 text-sm text-gray-600 hover:underline mb-4"
>
  <span className="text-lg">←</span>
  Back to all products
</Link>



      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* --- Image Gallery --- */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[350px] md:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group">
            <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 z-10 transition-colors duration-300">
              <IoIosArrowBack size={24} className="text-gray-800"/>
            </button>
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 z-10 transition-colors duration-300">
              <IoIosArrowForward size={24} className="text-gray-800"/>
            </button>
            
            <div className="absolute top-4 right-4 flex flex-col gap-3">
                <div className="relative">
                  <button 
                    onClick={handleShare} 
                    className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"
                    title="Share this product"
                  >
                    <FiShare2 size={18} />
                  </button>
                  {showShareTooltip && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      Link Copied!
                    </div>
                  )}
                </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 justify-center overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-md cursor-pointer border-2 overflow-hidden transition-all ${selectedImage === img ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* --- Product Info --- */}
        <div className="flex flex-col pt-0 md:pt-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-4 my-3 sm:my-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" />
              {/* Force Rating to 4.5 */}
              <span className="font-bold text-gray-800">4.5</span>
            </div>
          </div>
          <hr className="my-2" />
          <div className="my-4 sm:my-6">
            <h2 className="font-semibold text-lg mb-2">Description:</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {displayText}
              {isLongDescription && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-black font-semibold underline ml-1">
                  {isExpanded ? 'See Less' : 'See More...'}
                </button>
              )}
            </p>
          </div>
          <div className="space-y-3 text-sm sm:text-md my-6">
            {product.size && <div className="flex items-center"><p className="text-gray-600 w-16 sm:w-20">Size:</p><p className="font-bold">{product.size}</p><a href="#" className="text-gray-500 underline ml-auto text-xs sm:text-sm">View Size Chart</a></div>}
            {product.color && <div className="flex items-center"><p className="text-gray-600 w-16 sm:w-20">Color:</p><p className="font-bold">{product.color}</p></div>}
            {product.cloth && <div className="flex items-center"><p className="text-gray-600 w-16 sm:w-20">Cloth:</p><p className="font-bold">{product.cloth}</p></div>}
          </div>
          
          {/* Layout Fix: Always flex-row to ensure buttons stay side-by-side on mobile */}
          <div className="flex flex-row items-center gap-4 sm:gap-6 mt-6">
            <div className="flex items-center justify-between border border-gray-300 rounded-lg sm:w-auto h-12">
              <button onClick={() => handleQuantityChange(-1)} className="px-4 text-lg hover:bg-gray-100 rounded-l-lg transition h-full flex items-center justify-center">-</button>
              <span className="px-4 text-md font-bold select-none h-full flex items-center justify-center">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-4 text-lg hover:bg-gray-100 rounded-r-lg transition h-full flex items-center justify-center">+</button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isUpdatingCart} 
              className="flex-1 bg-[#222] text-white font-bold h-12 px-4 rounded-lg hover:bg-black transition-colors duration-300 disabled:opacity-50 text-center flex items-center justify-center text-sm sm:text-base"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* --- Related Products Section --- */}
      <div className="mt-12 md:mt-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Related Products</h2>
          {suggestionsData?.categoryId && (
            <Link
              to={`/products?category=${suggestionsData.categoryId}`}
              className="text-sm font-semibold text-gray-800 hover:underline"
            >
              View All
            </Link>
          )}
        </div>
        {suggestionsLoading && <p>Loading suggestions...</p>}
        {suggestionsError && <p className="text-red-500">Could not load suggestions.</p>}
        {!suggestionsLoading && !suggestionsError && (
          suggestionsData?.data?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {suggestionsData.data.map((suggestedProduct) => (
                <ProductCard
                  key={suggestedProduct._id}
                  product={suggestedProduct}
                  // Pass the managed state and handlers
                  quantity={suggestionQuantities[suggestedProduct._id] || 0}
                  onInitialAddToCart={handleSuggestionInitialAddToCart}
                  onQuantityChange={handleSuggestionQuantityChange}
                />
              ))}
            </div>
          ) : (
            <p>No related products found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDetail;