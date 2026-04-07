import React from "react";

const PoliciesSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* TITLE */}
      <div className="h-8 w-2/3 bg-gray-300 rounded mb-4"></div>

      {/* OBJECTIVE */}
      <div className="mb-6 space-y-2">
        <div className="h-5 w-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* REPEATABLE QUESTION BLOCK */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2">
            {/* Label */}
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>

            {/* Textarea */}
            <div className="h-24 w-full bg-gray-200 rounded-xl"></div>

            {/* Helper text */}
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        ))}

        {/* BUTTON */}
        <div className="flex justify-end pt-4">
          <div className="h-10 w-36 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesSkeleton;
