import React, { useState } from "react";
import {
  FiClipboard,
  FiFileText,
  FiGift,
  FiHeart,
  FiList,
  FiMessageSquare,
  FiTriangle,
} from "react-icons/fi";
import { MdInsights } from "react-icons/md";
import PlanningContent from "../components/home/PlanningContent";
import PlanningTools from "../components/home/PlanningTools";

const Dashboard = () => {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: "Self Assessment", icon: <FiHeart /> },
    { number: 2, title: "Program Needs List", icon: <FiList /> },
    { number: 3, title: "Gift Range Chart", icon: <FiGift /> },
    { number: 4, title: "Potential Donor Pyramid", icon: <FiTriangle /> },
    { number: 5, title: "Key Messages", icon: <FiMessageSquare /> },
    { number: 6, title: "Action Plan", icon: <FiClipboard /> },
    { number: 7, title: "Policies", icon: <FiFileText /> },
    { number: 8, title: "Plan Summary", icon: <MdInsights /> },
  ];

  return (
    <div className="p-2">
      {/* Fixed two‑column layout: sidebar (300px) + content */}
      <div className="grid grid-cols-[160px_1fr] gap-4">
        {/* Left: Tools */}
        <div>
          <PlanningTools steps={steps} step={step} setStep={setStep} />
        </div>

        {/* Right: Tool content */}
        <div>
          <PlanningContent step={step} setStep={setStep} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;