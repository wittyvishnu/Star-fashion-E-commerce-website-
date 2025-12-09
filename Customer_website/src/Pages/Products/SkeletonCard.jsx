import React from 'react';

const SkeletonCard = () => (
  <div className="w-full max-w-xs mx-auto animate-pulse">
    <div className="bg-gray-300 rounded-lg h-[280px]"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mt-4 mx-auto"></div>
    <div className="flex justify-between items-center w-full mt-4 px-2">
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
    </div>
  </div>
);

export default SkeletonCard;