import React, { useRef, useEffect, useState } from "react";
import { HEAT_CONFIG, HEAT_ORDER, LEVEL_ORDER, PYRAMID_WIDTHS } from "./heatConfig";
import { DonorCard } from "./DonorCard";

export const PyramidGrid = ({ donors, filterHeat, onEditDonor, onDeleteDonor, onAddDonor }) => {
  const gridRef = useRef(null);
  const [gridHeight, setGridHeight] = useState(380);
  const [gridWidth, setGridWidth] = useState(850);

  const getCell = (level, heat) => donors.filter((d) => d.level === level && d.heat === heat);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setGridHeight(entry.contentRect.height);
      setGridWidth(entry.contentRect.width);
    });
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Column Headers */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 w-full mb-2">
        <div />
        {HEAT_ORDER.map((h) => {
          const hc = HEAT_CONFIG[h];
          return (
            <div key={h} className="text-center">
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${hc.bg} border-[1.5px] ${hc.filterBorder} rounded-full text-xs font-bold ${hc.text}`}>
                <div className={`w-[7px] h-[7px] rounded-full ${hc.dot}`} />
                {hc.label}
                <span className="font-normal opacity-70">{hc.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rows */}
      <div ref={gridRef} className="relative z-10 w-full flex flex-col items-center">
        {LEVEL_ORDER.map((level, li) => (
          <div key={level} className={`${PYRAMID_WIDTHS[level]} ${li === 0 ? "mx-auto" : ""} transition-all duration-300`}>
            <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 items-start mb-2">
              {/* Row label */}
              <div className="flex items-center justify-end pr-2.5 pt-3">
                <span className="text-[11px] font-bold text-[#001033] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                  {level}
                </span>
              </div>

              {/* Cells */}
              {HEAT_ORDER.map((heat) => {
                const cell = getCell(level, heat).filter((d) => !filterHeat || d.heat === filterHeat);
                const hc = HEAT_CONFIG[heat];
                const isFiltered = filterHeat && filterHeat !== heat;
                return (
                  <div
                    key={heat}
                    className={`min-h-[120px] border-[1.5px] rounded-xl p-2.5 flex flex-col gap-2 transition-opacity duration-200 ${
                      isFiltered ? "bg-gray-50 border-gray-200 opacity-40" : hc.filterBorder
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold ${isFiltered ? "text-gray-400" : hc.text} opacity-60 uppercase tracking-wide`}>
                        {level} / {heat}
                      </span>
                      {cell.length > 0 && (
                        <span className={`${hc.countBg} ${hc.countText} rounded-xl text-[10px] font-bold px-1.5 py-0.5`}>
                          {cell.length}
                        </span>
                      )}
                    </div>

                    {cell.map((d) => (
                      <DonorCard key={d.id} donor={d} onEdit={onEditDonor} onDelete={onDeleteDonor} />
                    ))}

                    {!isFiltered && (
                      <button
                        onClick={() => onAddDonor(level, heat)}
                        className={`py-2 bg-transparent border-[1.5px] border-solid ${hc.filterBorder} rounded-lg ${hc.text} text-xs font-semibold cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-150`}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pyramid base */}
      <svg
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
        style={{ height: gridHeight, width: gridWidth }}
      >
        <polygon
          points={`${gridWidth / 2},0 0,${gridHeight} ${gridWidth},${gridHeight}`}
          fill="#f8fafc"
          stroke="#cbcbcb"
          strokeWidth="2.5"
          strokeDasharray="5 5"
        />
      </svg>
    </div>
  );
};