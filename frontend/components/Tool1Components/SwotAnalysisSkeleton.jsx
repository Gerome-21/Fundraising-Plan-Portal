import React from "react";

const SwotAnalysisSkeleton = () => {
  return (
    <section className="mb-8 pt-8 border-t border-gray-400 animate-pulse">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
        <div className="h-10 w-36 bg-gray-300 rounded-lg"></div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 shadow-md space-y-3">
            
            {/* TITLE */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>

            {/* TEXTAREA */}
            <div className="h-28 w-full bg-gray-200 rounded-lg"></div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default SwotAnalysisSkeleton;
