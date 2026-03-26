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
    { number: 4, title: "Potential Donor Pyramid", icon: <FiTriangle /> },
    { number: 5, title: "Key Messages and Communications", icon: <FiMessageSquare /> },
    { number: 6, title: "Fundraising Action Plan", icon: <FiClipboard /> },
    { number: 7, title: "Fundraising Policies Sentence Completion", icon: <FiFileText /> },
  ];

  // Define which tools should trigger compact view
  const compactViewTools = [2, 4, 6];
  const isCompactView = compactViewTools.includes(step);

  return (
    <div className="p-2">
      <div 
        className={`grid transition-all duration-500 ease-in-out gap-4 ${
          isCompactView ? 'grid-cols-[120px_1fr]' : 'grid-cols-[280px_1fr]'
        }`}
        style={{
          gridTemplateColumns: isCompactView ? '120px 1fr' : '280px 1fr'
        }}
      >
        {/* LEFT SIDE - Planning Tools */}
        <div className="transition-all duration-500 ease-in-out">
          <PlanningTools
            steps={steps}
            step={step}
            setStep={setStep}
            isCompactView={isCompactView}
          />
        </div>

        {/* RIGHT SIDE - Planning Content */}
        <div className="transition-all duration-500 ease-in-out">
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