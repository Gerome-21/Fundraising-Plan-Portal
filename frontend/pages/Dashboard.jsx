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

  return (
    <div className="p-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <PlanningTools
          steps={steps}
          step={step}
          setStep={setStep}
        />

        {/* RIGHT SIDE */}
        <PlanningContent
          step={step}
          setStep={setStep}
        />

      </div>

    </div>
  );
};

export default Dashboard;
