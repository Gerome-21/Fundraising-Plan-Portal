import React, { useState, useEffect  } from "react";
import { FiArrowDownLeft, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

const PlanningTools = ({ steps, step, setStep }) => {

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
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">

        <h3 className="text-xl font-bold text-[#001033] mb-4">
          Planning Tools
        </h3>

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
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${step === s.number
                      ? "bg-[#22864D] text-white"
                      : "bg-gray-300 text-gray-600"}
                  `}
                >
                  {s.icon}
                </div>

                <div>
                  <p className="text-xs text-gray-500">Tool {s.number}</p>
                  <p className="font-semibold text-gray-800">{s.title}</p>
                </div>

              </div>

              {index < visibleTools.length - 1 && (
                <div className="h-6 w-0.5 ml-5 bg-gray-300" />
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
