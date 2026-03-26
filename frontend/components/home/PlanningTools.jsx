import React, { useState, useEffect } from "react";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

const PlanningTools = ({ steps, step, setStep, isCompactView }) => {

  const toolsPerPage = 4;
  const [page, setPage] = useState(0);
  
  useEffect(() => {
    const newPage = Math.floor((step - 1) / toolsPerPage);
    setPage(newPage);
  }, [step]);

  const startIndex = page * toolsPerPage;
  const visibleTools = steps.slice(startIndex, startIndex + toolsPerPage);

  const totalPages = Math.ceil(steps.length / toolsPerPage);

  return (
    <div className="h-full transition-all duration-500 ease-in-out">
      <div 
        className={`bg-white rounded-2xl px-6 pt-6 pb-2 shadow-lg sticky top-8 transition-all duration-500 ease-in-out overflow-hidden ${
          isCompactView ? 'w-[120px]' : 'w-[280px]'
        }`}
        style={{
          width: isCompactView ? '120px' : '280px'
        }}
      >
        {/* Title with fade transition */}
        <div className="transition-all duration-500 ease-in-out">
          <h3 
            className={`text-xl font-bold text-[#001033] mb-4 transition-all duration-500 ease-in-out whitespace-nowrap ${
              isCompactView ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
            }`}
          >
            {isCompactView ? 'Tools' : 'Planning Tools'}
          </h3>
        </div>

        <div className="space-y-1 transition-all duration-500 ease-in-out">
          {visibleTools.map((s, index) => (
            <div key={s.number} className="transition-all duration-500 ease-in-out">
              <div
                onClick={() => setStep(s.number)}
                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300
                  ${step === s.number
                    ? "bg-[#40F58E]/20 border-l-4 border-[#22864D]"
                    : "bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100"}
                `}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${step === s.number
                      ? "bg-[#22864D] text-white"
                      : "bg-gray-300 text-gray-600"}
                  `}
                >
                  <div className="relative group">
                    <p className="transition-transform duration-300 group-hover:scale-110">{s.icon}</p>
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none">
                      {s.title}
                    </div>
                  </div>
                </div>

                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isCompactView ? 'opacity-100 w-6' : 'opacity-100 w-32'
                  }`}
                >
                  {!isCompactView ? (
                    <div className="transition-all duration-500">
                      <p className="text-xs text-gray-500">Tool {s.number}</p>
                      <p className="font-semibold text-gray-800 text-sm ">{s.title}</p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <p className="text-xs text-gray-500 font-bold">{s.number}</p>
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none">
                        {s.title}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {index < visibleTools.length - 1 && (
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isCompactView ? 'h-3' : 'h-6'
                  } w-0.5 ml-5 bg-gray-300`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
      {steps.length > toolsPerPage && (
        <div
          className={`flex justify-center mt-4 transition-all duration-500 ease-in-out ${
            isCompactView ? "scale-90" : "scale-100"
          }`}
        >
          <button
            onClick={() => {
              if (page < totalPages - 1) {
                setPage(page + 1); // go next
              } else {
                setPage(page - 1); // go back
              }
            }}
            disabled={totalPages <= 1}
            className="px-3 py-1 text-[#22864D] rounded disabled:text-gray-500 disabled:opacity-50 cursor-pointer transition-all duration-300 hover:scale-110"
          >
            {page < totalPages - 1 ? (
              <FiArrowRightCircle className="w-8 h-8" />
            ) : (
              <FiArrowLeftCircle className="w-8 h-8" />
            )}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PlanningTools;