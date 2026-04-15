import React from "react";
import { HEAT_CONFIG, HEAT_ORDER } from "./heatConfig";

export const HeatFilter = ({ filterHeat, setFilterHeat }) => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <button
        onClick={() => setFilterHeat(null)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-[1.5px] transition-colors ${
          !filterHeat
            ? "bg-[#001033] text-white border-[#001033]"
            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
        }`}
      >
        All
      </button>
      {HEAT_ORDER.map((h) => {
        const hc = HEAT_CONFIG[h];
        const active = filterHeat === h;
        return (
          <button
            key={h}
            onClick={() => setFilterHeat(active ? null : h)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-[1.5px] transition-colors ${
              active
                ? `${hc.filterBg} ${hc.filterBorderCs} ${hc.filterText}`
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {hc.label} — {hc.sub}
          </button>
        );
      })}
    </div>
  );
};