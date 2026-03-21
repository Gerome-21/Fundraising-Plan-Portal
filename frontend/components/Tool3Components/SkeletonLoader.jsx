import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-60 bg-gray-300 rounded"></div>
        <div className="h-10 w-40 bg-gray-300 rounded"></div>
      </div>

      {/* Objectives */}
      <div className="mb-6">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-80"></div>
          <div className="h-3 bg-gray-200 rounded w-72"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-3 py-3">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {[...Array(6)].map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-200">
              {[...Array(6)].map((_, i) => (
                <td key={i} className="px-3 py-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default SkeletonLoader