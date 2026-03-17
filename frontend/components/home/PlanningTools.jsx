import React, { useState, useEffect } from "react";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

const PlanningTools = ({ steps, step, setStep }) => {

  const toolsPerPage = 4;
  const [page, setPage] = useState(0);
  
  const compactViewTools = [2, 3, 6]; // Tool 2, Tool 3, and Tool 6
  
  const isCompactView = compactViewTools.includes(step);
  
  useEffect(() => {
    const newPage = Math.floor((step - 1) / toolsPerPage);
    setPage(newPage);
  }, [step]);

  const startIndex = page * toolsPerPage;
  const visibleTools = steps.slice(startIndex, startIndex + toolsPerPage);

  const totalPages = Math.ceil(steps.length / toolsPerPage);

  const columnSpanClass = isCompactView ? "lg:col-span-1" : "lg:col-span-1";
  
  const widthClass = isCompactView ? "w-full" : "w-full";

  return (
    <div className={`${columnSpanClass} transition-all duration-300`}>
      <div className={`bg-white rounded-2xl p-6 shadow-lg sticky top-8 ${widthClass}`}>
        
        {/* Title - hide in compact view */}
        {!isCompactView ? (
          <h3 className="text-xl font-bold text-[#001033] mb-4">
            Planning Tools
          </h3>) : (

          <h3 className="text-xl font-bold text-[#001033] mb-4">
            Tool
          </h3>)
        }

        <div className="space-y-1">
          {visibleTools.map((s, index) => (
            <div key={s.number}>
              <div
                onClick={() => setStep(s.number)}
                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all
                  ${step === s.number
                    ? "bg-[#40F58E]/20 border-l-4 border-[#22864D]"
                    : "bg-gray-50 border-l-4 border-gray-300"}
                `}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${step === s.number
                      ? "bg-[#22864D] text-white"
                      : "bg-gray-300 text-gray-600"}
                  `}
                >
                  <div className="relative group">
                    <p>{s.icon}</p>
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {s.title}
                    </div>
                  </div>
                  
                </div>

                {!isCompactView ? (
                  <div>
                    <p className="text-xs text-gray-500">Tool {s.number}</p>
                    <p className="font-semibold text-gray-800">{s.title}</p>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-xs text-gray-500">{s.number}</p>
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {s.title}
                    </div>
                  </div>
                )}
              </div>

              {!isCompactView ? (
               <>
                {index < visibleTools.length - 1 && (
                  <div className="h-6 w-0.5 ml-5 bg-gray-300" />
                )}
               </>
              ) : (
                <>
                {index < visibleTools.length - 1 && (
                  <div className="h-3 w-0.5 ml-5 bg-gray-300" />
                )}
                </>
              )}
            </div>
          ))}
        </div>

        {steps.length > toolsPerPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 text-[#22864D] rounded disabled:text-gray-500 disabled:opacity-50 cursor-pointer"
            >
              <FiArrowLeftCircle className="w-5 h-5"/>
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className="px-3 py-1 text-[#22864D] rounded disabled:text-gray-500 disabled:opacity-50 cursor-pointer"
            >
              <FiArrowRightCircle className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningTools;