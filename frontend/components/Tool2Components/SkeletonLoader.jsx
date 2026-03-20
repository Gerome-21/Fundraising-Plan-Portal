import React from 'react'

const SkeletonLoader = () => {
  const years = ["2026", "2027", "2028", "2029", "2030"];
  return (
    <div className="animate-pulse">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-300 rounded w-64"></div>
        <div className="h-10 bg-gray-300 rounded w-40"></div>
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
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </th>
              {years.map((year) => (
                <th key={year} className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                </th>
              ))}
              <th className="p-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {/* Simulate 4 rows */}
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>

                {years.map((year) => (
                  <td key={year} className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}

                <td className="p-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>

                <td></td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="border-t">
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </td>
              {years.map((year) => (
                <td key={year} className="p-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SkeletonLoader