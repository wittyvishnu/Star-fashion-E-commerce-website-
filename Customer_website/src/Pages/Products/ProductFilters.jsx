import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const filterCategories = ["Gender", "Category", "Price", "Brand", "Rating"];
const genders = ["male", "female", "unisex", "kids"];

const ProductFilters = ({
  isOpen,
  onClose,
  initialFilters,
  onApplyFilters,
  brands = [],
  categories = [],
}) => {
  const [activeCategory, setActiveCategory] = useState("Gender");
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: prev[name] === value ? "" : value,
    }));
  };

  const handleBrandChange = (brandName) => {
    const currentBrands = localFilters.brands || [];
    const newBrands = currentBrands.includes(brandName)
      ? currentBrands.filter((b) => b !== brandName)
      : [...currentBrands, brandName];
    setLocalFilters((prev) => ({ ...prev, brands: newBrands }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => { onApplyFilters(localFilters); onClose(); };
  const handleClear = () => { onApplyFilters({}); onClose(); };

  const renderFilterOptions = () => {
    // ... (This function does not need any changes)
    switch (activeCategory) {
      case "Gender":
        return ( <div className="flex flex-wrap gap-3"> {genders.map(gender => ( <label key={gender} className={`px-4 py-2 text-sm border rounded-full cursor-pointer capitalize ${ localFilters.gender === gender ? 'bg-blue-500 text-white' : 'hover:bg-gray-100' }`}> <input type="radio" name="gender" value={gender} className="hidden" checked={localFilters.gender === gender} onChange={handleToggleChange} /> {gender} </label>))} </div> );
      case "Category":
        return ( <div className="flex flex-wrap gap-3"> {categories.map(cat => ( <label key={cat._id} className={`px-4 py-2 text-sm border rounded-full cursor-pointer ${ localFilters.category === cat._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100' }`}> <input type="radio" name="category" value={cat._id} className="hidden" checked={localFilters.category === cat._id} onChange={handleToggleChange} /> {cat.name} </label>))} </div> );
      case "Price":
         return ( <div className="flex items-center gap-2"> <input type="number" name="minPrice" placeholder="Min" value={localFilters.minPrice || ''} onChange={handleInputChange} className="w-full p-2 border rounded" min="0"/> <span className="text-gray-500">-</span> <input type="number" name="maxPrice" placeholder="Max" value={localFilters.maxPrice || ''} onChange={handleInputChange} className="w-full p-2 border rounded" min="0"/> </div> );
      case "Brand":
        return ( <div className="flex flex-wrap gap-3"> {brands.map(brand => ( <label key={brand} className={`px-4 py-2 text-sm border rounded-full cursor-pointer ${ (localFilters.brands || []).includes(brand) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100' }`}> <input type="checkbox" className="hidden" checked={(localFilters.brands || []).includes(brand)} onChange={() => handleBrandChange(brand)} /> {brand} </label>))} </div> );
      case "Rating":
        return ( <div className="space-y-2"> {[4, 3, 2, 1].map(r => ( <label key={r} className="flex items-center cursor-pointer"> <input type="radio" name="rating" value={r} className="form-radio" checked={localFilters.rating === String(r)} onChange={handleToggleChange} /> <span className="ml-2 text-gray-700">{r} Stars & up</span> </label> ))} </div> );
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          
          className="absolute top-24 left-6 w-full max-w-2xl bg-white border rounded-lg shadow-2xl p-4 z-50"
          
        >
          <div className="flex">
            <div className="w-1/3 border-r pr-4">
              <h3 className="font-semibold mb-2 text-gray-500">Suggested Filters</h3>
              <ul className="space-y-1">
                {filterCategories.map(cat => (
                  <li key={cat}>
                    <button onClick={() => setActiveCategory(cat)} type="button" className={`w-full text-left px-3 py-2 rounded ${activeCategory === cat ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-2/3 pl-4">
              <div className="flex justify-end mb-2">
                <button onClick={onClose} type="button" className="p-1 rounded-full hover:bg-gray-100">
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              {renderFilterOptions()}
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <button onClick={handleClear} type="button" className="px-6 py-2 text-gray-700 border rounded-md hover:bg-gray-50">Clear Filters</button>
            <button onClick={handleApply} type="button" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Show Results</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFilters;