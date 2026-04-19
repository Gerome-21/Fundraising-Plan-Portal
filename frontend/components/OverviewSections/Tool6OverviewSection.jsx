// components/OverviewSections/Tool6OverviewSection.jsx
import React from 'react';

const ACTION_YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

const fmt = (num) =>
  (parseFloat(num) || 0) === 0
    ? '—'
    : `₱ ${(parseFloat(num) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtTotal = (num) =>
  `₱ ${(num || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Per-program block ──────────────────────────────────────────────────────
const ProgramBlock = ({ program, index }) => {
  const hasStrategies = program.strategies.length > 0;

  // Per-strategy year totals
  const strategyNetByYear = (strategy) =>
    ACTION_YEARS.map((_, yi) => ({
      expenses: parseFloat(strategy.years[yi]?.expenses) || 0,
      revenue:  parseFloat(strategy.years[yi]?.revenue)  || 0,
    }));

  // Program-level totals
  const programTotals = ACTION_YEARS.map((_, yi) => ({
    expenses: program.strategies.reduce((s, st) => s + (parseFloat(st.years[yi]?.expenses) || 0), 0),
    revenue:  program.strategies.reduce((s, st) => s + (parseFloat(st.years[yi]?.revenue)  || 0), 0),
  }));

  return (
    <div className="mb-6 border">

      {/* Program header */}
      <div className="bg-black px-4 py-2.5 flex items-center gap-2">
        <span className="text-white text-[10px] font-bold uppercase tracking-widest opacity-60">
          Program {index + 1}
        </span>
        <span className="text-white text-sm font-bold">
          {program.name || <span className="opacity-50 italic">Unnamed Program</span>}
        </span>
      </div>

      {!hasStrategies ? (
        <p className="text-xs text-gray-400 italic px-4 py-3">No strategies added.</p>
      ) : (
        <table className="w-full text-xs">
          {/* Column headers */}
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-gray-500 font-semibold w-44">Strategy</th>
              {ACTION_YEARS.map(y => (
                <th key={y} colSpan={2} className="px-2 py-2 text-center text-gray-500 font-semibold border-l border-gray-200">
                  {y}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400">
              <th />
              {ACTION_YEARS.map(y => (
                <React.Fragment key={y}>
                  <th className="px-2 py-1 text-center border-l border-gray-200">Expenses</th>
                  <th className="px-2 py-1 text-center">Revenue</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {program.strategies.map((strategy, si) => {
              const yearData = strategyNetByYear(strategy);
              return (
                <tr key={strategy.id} className={`border-t ${si % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  {/* Strategy name */}
                  <td className="px-4 py-2 font-medium text-gray-700 leading-tight">
                    {strategy.name || <span className="text-gray-300 italic">Unnamed</span>}
                  </td>

                  {yearData.map((yd, yi) => (
                    <React.Fragment key={yi}>
                      <td className="px-3 py-2 text-[10px] text-right border-l border-gray-100 text-gray-600">
                        {yd.expenses > 0
                          ? <span>{fmt(yd.expenses)}</span>
                          : <span className="text-gray-200">—</span>
                        }
                      </td>
                      <td className="px-3 py-2 text-[10px] text-right text-gray-600">
                        {yd.revenue > 0
                          ? <span className="text-[#22864D] font-medium">{fmt(yd.revenue)}</span>
                          : <span className="text-gray-200">—</span>
                        }
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>

          {/* Program subtotals */}
          <tfoot className="bg-gray-100 border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                Subtotal
              </td>
              {programTotals.map((pt, yi) => (
                <React.Fragment key={yi}>
                  <td className="px-3 py-2 text-[10px] text-right font-bold text-gray-700 border-l border-gray-200">
                    {pt.expenses > 0 ? fmtTotal(pt.expenses) : <span className="text-gray-300 font-normal">—</span>}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-right font-bold text-[#22864D]">
                    {pt.revenue > 0 ? fmtTotal(pt.revenue) : <span className="text-gray-300 font-normal">—</span>}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

// ── Grand totals footer ────────────────────────────────────────────────────
const GrandTotalsRow = ({ totals }) => {
  const hasAny = totals.expenses.some(v => v > 0) || totals.revenue.some(v => v > 0);
  if (!hasAny) return null;

  return (
    <div className="border mt-2">
      <div className="bg-[#001033] px-4 py-2">
        <span className="text-white text-[10px] font-bold uppercase tracking-widest">
          Grand Total — All Programs
        </span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400">
            <th className="px-4 py-1.5 text-left w-44" />
            {ACTION_YEARS.map(y => (
              <React.Fragment key={y}>
                <th className="px-3 py-1.5 text-center border-l border-gray-200 text-gray-500 font-semibold text-[10px]">
                  {y} Exp.
                </th>
                <th className="px-3 py-1.5 text-center text-gray-500 font-semibold text-[10px]">
                  {y} Rev.
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="px-4 py-2.5 font-bold text-gray-700 uppercase tracking-wide text-xs">
              TOTAL
            </td>
            {ACTION_YEARS.map((_, yi) => (
              <React.Fragment key={yi}>
                <td className="px-3 py-2.5 text-[10px] text-right font-bold text-gray-800 border-l border-gray-100">
                  {totals.expenses[yi] > 0
                    ? fmtTotal(totals.expenses[yi])
                    : <span className="text-gray-300 font-normal">—</span>
                  }
                </td>
                <td className="px-3 py-2.5 text-[10px] text-right font-bold text-[#22864D]">
                  {totals.revenue[yi] > 0
                    ? fmtTotal(totals.revenue[yi])
                    : <span className="text-gray-300 font-normal">—</span>
                  }
                </td>
              </React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ── Funding prospects notes block ──────────────────────────────────────────
// Same pattern as Tool 2 comments — only rendered if at least one exists
const FundingNotesBlock = ({ notes }) => {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="mt-4 border border-gray-200 p-4 bg-gray-50 text-xs space-y-2.5">
      <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
        Funding Prospects / Notes
      </p>
      {notes.map((n, i) => (
        <div key={i} className="flex gap-2">
          <span className="shrink-0 font-semibold text-gray-700 min-w-[200px]">
            {n.program} — {n.strategy}:
          </span>
          <span className="text-gray-600 leading-relaxed">{n.note}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main export ────────────────────────────────────────────────────────────
const Tool6OverviewSection = ({ programs, totals, fundingNotes }) => {
  if (!programs || programs.length === 0) {
    return (
      <section className="mb-14">
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">
          Tool 6 — Fundraising Action Plan
        </h3>
        <p className="text-sm text-gray-400 italic">No action plan data entered yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">
        Tool 6 — Fundraising Action Plan
      </h3>
      <section className="mb-6">
        <h3 className="font-semibold text-[#001033] mb-2">Objectives</h3>
        <ul className="text-sm list-disc pl-6 space-y-1">
          <li>To develop a strategic, realistic, and organized Fundraising Action Plan for your Organization</li>
          <li>To practice Fundraising planning skills</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          Identify fund sources and corresponding strategies that can be pursued in the period of five (5) years.<br/> Briefly identify the specific objectives of the activities (amount to be raised, stakeholders to be involved).
        </p>
      </section>

      {/* One block per program */}
      {programs.map((program, i) => (
        <ProgramBlock key={program.id} program={program} index={i} />
      ))}

      {/* Grand totals across all programs */}
      <GrandTotalsRow totals={totals} />

      {/* Funding prospects notes — only if any exist */}
      <FundingNotesBlock notes={fundingNotes} />
    </section>
  );
};

export default Tool6OverviewSection;