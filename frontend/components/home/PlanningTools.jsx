import React from "react";

const PlanningTools = ({ steps, step, setStep }) => {
  const currentTool = steps.find((t) => t.number === step);
  const firstColumn  = steps.slice(0, 4);
  const secondColumn = steps.slice(4, 8);

  return (
    <div className="sticky top-8 flex flex-col gap-0">

      {/* ── Single unified card ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── Brand strip ───────────────────────────────────────── */}
        <div className="bg-[#001033] px-4 pt-4 pb-5">

          {/* Brand identity line */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#40F58E]">
              Planning Tools
            </p>
            {/* Step counter pill */}
            <p className="text-xs font-bold text-[#40F58E] whitespace-nowrap px-3 py-1 border border-white/10 rounded-full">
              {step}/{steps.length}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/8 mb-4" />

          {/* Current tool display */}
          {currentTool && (
            <div className="flex items-start gap-3">
              {/* Icon bubble */}
              <div className="shrink-0 w-9 h-9 rounded-xl bg-[#40F58E]/15 border border-[#40F58E]/25 flex items-center justify-center text-[#40F58E] text-base">
                {currentTool.icon}
              </div>

              {/* Label + Title */}
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-[9px] font-bold tracking-widest uppercase text-white/35 mb-0.5">
                  Tool {currentTool.number}
                </p>
                <p className="text-sm font-semibold text-white leading-snug">
                  {currentTool.title}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Connector notch — visually joins header to grid ───── */}
        <div className="h-px bg-gray-100" />

        {/* ── Step grid ─────────────────────────────────────────── */}
        <div className="p-3">
          <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-[0.15em] mb-2.5 px-1">
            Steps
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              {firstColumn.map((tool) => {
                const isActive = step === tool.number;
                const isPast   = step > tool.number;
                return (
                  <button
                    key={tool.number}
                    onClick={() => setStep(tool.number)}
                    title={tool.title}
                    className={`
                      w-full flex items-center justify-between
                      px-2.5 py-2 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-[#22864D] shadow-md shadow-[#22864D]/25"
                        : isPast
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-lg flex items-center justify-center
                      text-[11px] font-bold transition-all duration-200
                      ${isActive
                        ? "bg-white/20 text-white"
                        : isPast
                          ? "bg-[#22864D]/12 text-[#22864D]"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}>
                      {tool.number}
                    </div>

                    {/* Active pulse dot */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#40F58E]" />
                    )}

                    {/* Past step subtle line */}
                    {isPast && !isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22864D]/30" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              {secondColumn.map((tool) => {
                const isActive = step === tool.number;
                const isPast   = step > tool.number;
                return (
                  <button
                    key={tool.number}
                    onClick={() => setStep(tool.number)}
                    title={tool.title}
                    className={`
                      w-full flex items-center justify-between
                      px-2.5 py-2 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-[#22864D] shadow-md shadow-[#22864D]/25"
                        : isPast
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-lg flex items-center justify-center
                      text-[11px] font-bold transition-all duration-200
                      ${isActive
                        ? "bg-white/20 text-white"
                        : isPast
                          ? "bg-[#22864D]/12 text-[#22864D]"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}>
                      {tool.number}
                    </div>

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