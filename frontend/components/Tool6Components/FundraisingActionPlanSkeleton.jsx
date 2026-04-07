import React from "react";

// Reusable skeleton block
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const FundraisingActionPlanSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-10 rounded-full w-10" />
      </div>

      {/* Objectives */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Add Program Button */}
      <Skeleton className="h-10 w-40 rounded-lg mb-4" />

      {/* Table Skeleton */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-xs">
          
          {/* Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="px-4 py-3">
                <Skeleton className="h-4 w-32 bg-gray-400" />
              </th>
              {[1,2,3,4,5].map((y) => (
                <th key={y} colSpan="2" className="px-4 py-3 text-center">
                  <Skeleton className="h-4 w-16 mx-auto bg-gray-400" />
                </th>
              ))}
              <th></th>
            </tr>

            <tr className="bg-gray-200">
              <th></th>
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <th className="px-2 py-2">
                    <Skeleton className="h-3 w-14 mx-auto" />
                  </th>
                  <th className="px-2 py-2">
                    <Skeleton className="h-3 w-14 mx-auto" />
                  </th>
                </React.Fragment>
              ))}
              <th></th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {[1, 2].map((program) => (
              <React.Fragment key={program}>
                
                {/* Program Row */}
                <tr className="bg-gray-100 border-t">
                  <td colSpan="13" className="px-4 py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </td>
                </tr>

                {/* Strategy Rows */}
                {[1, 2].map((strategy) => (
                  <tr key={strategy} className="border-t">
                    
                    {/* Strategy Name */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-full rounded" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </td>

                    {/* Year Columns */}
                    {[...Array(5)].map((_, i) => (
                      <React.Fragment key={i}>
                        <td className="px-2 py-2">
                          <Skeleton className="h-6 w-full rounded" />
                        </td>
                        <td className="px-2 py-2">
                          <Skeleton className="h-6 w-full rounded" />
                        </td>
                      </React.Fragment>
                    ))}

                    {/* Delete Icon */}
                    <td className="px-2 py-2">
                      <Skeleton className="h-4 w-4" />
                    </td>
                  </tr>
                ))}

                {/* Add Strategy Row */}
                <tr>
                  <td colSpan="13" className="px-4 py-3">
                    <Skeleton className="h-4 w-32" />
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>

          {/* Footer Totals */}
          <tfoot className="bg-gray-100 border-t-2">
            <tr>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <td className="px-2 py-2">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                  <td className="px-2 py-2">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                </React.Fragment>
              ))}
              <td></td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default FundraisingActionPlanSkeleton;
