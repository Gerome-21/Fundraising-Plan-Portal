import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Tool1SelfAssessment from "./tools/Tool1SelfAssessment";
import Tool2ProgramNeeds from "./tools/Tool2ProgramNeeds";
import Tool3GiftRange from "./tools/Tool3GiftRange";
import Tool4DonorPyramid from "./tools/Tool4DonorPyramid";
import Tool5KeyMessages from "./tools/Tool5KeyMessages";
import Tool6ActionPlan from "./tools/Tool6ActionPlan";
import Tool7Policies from "./tools/Tool7Policies";

const PlanningContent = ({ step, setStep }) => {
  return (
    <div className="transition-all duration-500 ease-in-out">
      <div className="bg-white rounded-2xl shadow-2xl p-6 transition-all duration-500 ease-in-out">
        {/* Content with fade transition */}
        <div className="transition-opacity duration-500 ease-in-out">
          {/* TOOL 1 */}
          {step === 1 && <Tool1SelfAssessment />}

          {/* TOOL 2 */}
          {step === 2 && <Tool2ProgramNeeds />}

          {/* TOOL 3 */}
          {step === 3 && <Tool3GiftRange />}

          {/* TOOL 4 */}
          {step === 4 && <Tool4DonorPyramid />}

          {/* TOOL 5 */}
          {step === 5 && <Tool5KeyMessages />}

          {/* TOOL 6 */}
          {step === 6 && <Tool6ActionPlan />}

          {/* TOOL 7 */}
          {step === 7 && <Tool7Policies />}
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 flex justify-between transition-all duration-500 ease-in-out">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105"
            >
              <FiArrowLeft className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1"/>Prev
            </button>
          )}

          {step < 7 && (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-1 px-3 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105"
            >
               Next <FiArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningContent;