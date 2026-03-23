import React from "react";

const SkeletonBox = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DonorPyramidSkeleton = () => {
  return (
    <div className="px-1">

      {/* HEADER */}
      <div className="mb-6">
        <SkeletonBox className="h-6 w-64 mb-2" />
        <SkeletonBox className="h-3 w-40" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2.5 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-3">
            <SkeletonBox className="h-5 w-10 mx-auto mb-2" />
            <SkeletonBox className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>

      {/* PYRAMID GRID */}
      <div className="flex flex-col items-center gap-3">

        {/* ROWS */}
        {["w-3/5", "w-4/5", "w-full"].map((width, rowIndex) => (
          <div key={rowIndex} className={`${width}`}>
            <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2">

              {/* LABEL */}
              <div className="flex justify-end items-center">
                <SkeletonBox className="h-16 w-4" />
              </div>

              {/* CELLS */}
              {Array.from({ length: 3 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="min-h-[120px] border rounded-xl p-2 flex flex-col gap-2"
                >
                  <SkeletonBox className="h-3 w-20" />

                  {/* Fake donor cards */}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <SkeletonBox className="w-7 h-7 rounded-full" />
                      <SkeletonBox className="h-3 w-24" />
                    </div>
                  ))}

                  <SkeletonBox className="h-6 w-full rounded-md mt-auto" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div className="mt-6 bg-gray-100 rounded-xl p-4">
        <SkeletonBox className="h-4 w-32 mb-2" />
        <SkeletonBox className="h-3 w-full mb-1" />
        <SkeletonBox className="h-3 w-5/6" />
      </div>

    </div>
  );
};

export default DonorPyramidSkeleton;
