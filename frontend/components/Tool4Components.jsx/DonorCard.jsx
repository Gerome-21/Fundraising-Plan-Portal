import React from "react";
import { HEAT_CONFIG } from "./heatConfig";

const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const CIcon = ({ active }) => (
  <span
    className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-semibold flex-shrink-0 border-[1.5px] ${
      active ? "bg-[#001033] text-white border-[#001033]" : "bg-transparent text-gray-400 border-gray-300"
    }`}
  >
    C
  </span>
);

export const DonorCard = ({ donor, onEdit, onDelete }) => {
  const hc = HEAT_CONFIG[donor.heat];
  const cs = [donor.connection, donor.capability, donor.concern];
  
  return (
    <div
      className={`${hc.bg} border ${hc.border} rounded-xl p-2 flex flex-col gap-1 cursor-pointer transition-transform duration-150 hover:scale-[1.02]`}
      onClick={() => onEdit(donor)}
    >
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full ${hc.badgeBg} flex items-center justify-center text-[10px] font-bold ${hc.badgeText} flex-shrink-0`}>
          {getInitials(donor.name)}
        </div>
        <span className={`text-xs font-semibold ${hc.text} flex-1 leading-tight line-clamp-1`}>
          {donor.name}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(donor.id); }}
          className="bg-transparent border-none cursor-pointer text-gray-400 text-sm leading-none px-0.5 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="flex gap-1 pl-0.5">
        {["Con", "Cap", "Concern"].map((label, i) => (
          <div key={label} className="flex items-center gap-0.5">
            <CIcon active={cs[i]} />
            <span className={`text-[9px] ${hc.text} opacity-70`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};