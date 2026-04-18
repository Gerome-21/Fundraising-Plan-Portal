import React from "react";

const PlanningTools = ({ steps, step, setStep }) => {
  const currentTool = steps.find((t) => t.number === step);
  const firstColumn = steps.slice(0, 4);
  const secondColumn = steps.slice(4, 8);

  return (
    <div className="sticky top-8 flex flex-col gap-0">
      {/* ── Single unified card (removed overflow-hidden) ────────── */}
      <div className="bg-white rounded-2xl shadow-lg">
        {/* ── Light‑mode brand strip ───────────────────────────────── */}
        <div className="bg-gray-50 px-4 pt-4 pb-5 border-b border-gray-200 rounded-t-2xl">
          {/* Brand identity line */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-500">
              Planning Tools
            </p>
            {/* Step counter pill */}
            <p className="text-xs font-bold text-[#22864D] whitespace-nowrap px-3 py-1 border border-gray-300 rounded-full">
              {step}/{steps.length}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-4" />

          {/* Current tool section with explicit label */}
          {currentTool && (
            <>
              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                Current tool
              </p>
              <div className="flex items-start gap-3">
                {/* Icon bubble */}
                <div className="shrink-0 w-9 h-9 rounded-xl bg-[#40F58E]/10 border border-[#40F58E]/30 flex items-center justify-center text-[#22864D] text-base">
                  {currentTool.icon}
                </div>

                {/* Label + Title */}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">
                    Tool {currentTool.number}
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    {currentTool.title}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Step grid (enhanced visibility) ──────────────────────── */}
        <div className="p-3">
          <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-[0.15em] mb-2.5 px-1">
            Steps
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Column 1 (tools 1‑4) */}
            <div className="flex flex-col gap-2">
              {firstColumn.map((tool) => {
                const isActive = step === tool.number;
                const isPast = step > tool.number;
                return (
                  <button
                    key={tool.number}
                    onClick={() => setStep(tool.number)}
                    className={`
                      relative group w-full flex items-center justify-between
                      px-2.5 py-2 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-[#22864D] shadow-md shadow-[#22864D]/25 ring-2 ring-[#40F58E] ring-offset-1"
                        : isPast
                          ? "bg-green-50 hover:bg-green-100 border border-green-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-6 h-6 rounded-lg flex items-center justify-center
                        text-[11px] font-bold transition-all duration-200
                        ${isActive
                          ? "bg-white/20 text-white"
                          : isPast
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >
                      {tool.number}
                    </div>

                    {/* Hover tooltip (now overflows the card) */}
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {tool.title}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#40F58E]" />
                    )}

                    {/* Past step subtle dot */}
                    {isPast && !isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22864D]/30" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Column 2 (tools 5‑8) */}
            <div className="flex flex-col gap-2">
              {secondColumn.map((tool) => {
                const isActive = step === tool.number;
                const isPast = step > tool.number;
                return (
                  <button
                    key={tool.number}
                    onClick={() => setStep(tool.number)}
                    className={`
                      relative group w-full flex items-center justify-between
                      px-2.5 py-2 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-[#22864D] shadow-md shadow-[#22864D]/25 ring-2 ring-[#40F58E] ring-offset-1"
                        : isPast
                          ? "bg-green-50 hover:bg-green-100 border border-green-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-6 h-6 rounded-lg flex items-center justify-center
                        text-[11px] font-bold transition-all duration-200
                        ${isActive
                          ? "bg-white/20 text-white"
                          : isPast
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >
                      {tool.number}
                    </div>

                    {/* Hover tooltip (now overflows) */}
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {tool.title}
                    </span>

                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#40F58E]" />
                    )}
                    {isPast && !isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22864D]/30" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningTools;