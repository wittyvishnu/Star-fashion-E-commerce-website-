import React from "react";

const SearchBar = ({ toggleSearchBar }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 md:hidden z-10">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <button
        onClick={toggleSearchBar}
        className="absolute top-2 right-4 text-gray-800"
      >
        X
      </button>
    </div>
  );
};

export default SearchBar;
