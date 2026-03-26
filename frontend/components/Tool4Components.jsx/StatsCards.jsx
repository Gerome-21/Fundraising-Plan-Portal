import React from "react";

export const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2.5 mb-6">
      {stats.map(({ label, value, color, bg }) => (
        <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
          <p className={`m-0 text-lg font-bold ${color}`}>{value}</p>
          <p className={`m-0 mt-1 text-[10px] font-semibold ${color} opacity-75 uppercase tracking-wide`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};