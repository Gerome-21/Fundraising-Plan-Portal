import React from "react";

// Reusable skeleton block
const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const KeyMessagesSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center flex-wrap gap-4">
        <SkeletonBox className="h-8 w-80" />
        <SkeletonBox className="h-10 w-40 rounded-lg" />
      </div>

      {/* Objectives */}
      <div className="mb-6 space-y-2">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
        <SkeletonBox className="h-4 w-2/3" />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((section) => (
          <div
            key={section}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gray-200 px-6 py-4">
              <SkeletonBox className="h-5 w-60 bg-gray-300" />
            </div>

            {/* Section Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((col) => (
                  <div key={col} className="border rounded-xl overflow-hidden">
                    {/* Donor Type Header */}
                    <div className="px-4 py-3 border-b">
                      <SkeletonBox className="h-4 w-32" />
                    </div>

                    {/* Inputs */}
                    <div className="p-4 space-y-4">
                      {[1, 2, 3].map((row) => (
                        <div key={row}>
                          <SkeletonBox className="h-3 w-24 mb-2" />
                          <SkeletonBox className="h-10 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyMessagesSkeleton;
