import React, { useState } from "react";
import { FiClipboard, FiFileText, FiGift, FiHeart, FiLayers, FiList, FiMessageSquare, FiTriangle } from "react-icons/fi";
import PlanningContent from "../components/home/PlanningContent";
import PlanningTools from "../components/home/PlanningTools";

const Dashboard = () => {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: "Self Assessment", icon: <FiHeart /> },
    { number: 2, title: "Program Needs List", icon: <FiList /> },
    { number: 3, title: "Gift Range Chart", icon: <FiGift /> },
    { number: 4, title: "Potential Donor Pyramid", icon: <FiLayers /> },
    { number: 5, title: "Key Messages and Communications", icon: <FiMessageSquare /> },
    { number: 6, title: "Fundraising Action Plan", icon: <FiClipboard /> },
    { number: 7, title: "Fundraising Policies Sentence Completion", icon: <FiFileText /> },
  ];

  // Define which tools should trigger compact view
  const compactViewTools = [2, 3, 6];
  const isCompactView = compactViewTools.includes(step);

  return (
    <div className="p-4">
      <div className={`grid grid-cols-1 gap-8 transition-all duration-600 ${
        isCompactView ? 'lg:grid-cols-[10%_90%]' : 'lg:grid-cols-3'
      }`}>
        {/* LEFT SIDE - Planning Tools */}
        <PlanningTools
          steps={steps}
          step={step}
          setStep={setStep}
        />

        {/* RIGHT SIDE - Planning Content */}
        <div className={isCompactView ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <PlanningContent
            step={step}
            setStep={setStep}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;