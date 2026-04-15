// components/OverviewSections/Tool2OverviewSection.jsx
import React from 'react';

const fmt = (num) =>
  num === 0 ? '0' : num.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

const Tool2OverviewSection = ({
  requirements, committedFunds, years,
  requirementTotals, committedTotals, gaps,
}) => {

  // Filter only items that actually have a comment
  const requirementsWithComments = requirements.filter(
    r => r.comments && r.comments.trim() !== ''
  );
  const committedWithComments = committedFunds.filter(
    f => f.comments && f.comments.trim() !== ''
  );
  const hasAnyComments = requirementsWithComments.length > 0 || committedWithComments.length > 0;

  return (
    <section className="mb-10">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">
        Tool 2 — Program Needs List
      </h3>
      <section className="mb-6 ">
        <h3 className="font-semibold mb-2">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-6 space-y-1">
          <li>To determine the funds needed by the program</li>
          <li>To identify the difference between the program requirements and the committed funds</li>
        </ul>
      </section>

      <div className="overflow-x-auto rounded-lg border text-xs">
        <table className="min-w-full">
          <thead>
            <tr className="bg-black text-white">
              {/* No COMMENTS column here */}
              <th className="px-4 py-3 text-left w-64">Item</th>
              {years.map(y => (
                <th key={y} className="px-3 py-3 text-center">{y}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ── Section A ─────────────────────────── */}
            <tr className="bg-gray-100">
              <td colSpan={6} className="px-4 py-2 font-semibold text-gray-600 uppercase tracking-wide">
                A. Program Requirements
              </td>
            </tr>

            {requirements.map((req, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{req.name || <span className="text-gray-400 italic">Unnamed</span>}</td>
                {years.map(y => (
                  <td key={y} className="px-4 py-2 text-right">{fmt(req.budgets[y] || 0)}</td>
                ))}
              </tr>
            ))}

            <tr className="bg-gray-100 font-bold border-t">
              <td className="px-4 py-2">TOTAL A</td>
              {requirementTotals.map((t, i) => (
                <td key={i} className="px-4 py-2 text-right">{fmt(t)}</td>
              ))}
            </tr>

            {/* ── Section B ─────────────────────────── */}
            <tr className="bg-black text-white">
              <td colSpan={6} className="px-4 py-2 font-semibold uppercase tracking-wide">
                B. Committed Funds
              </td>
            </tr>

            {committedFunds.map((fund, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{fund.name}</td>
                {years.map(y => (
                  <td key={y} className="px-4 py-2 text-right">{fmt(fund.budgets[y] || 0)}</td>
                ))}
              </tr>
            ))}

            <tr className="bg-gray-100 font-bold border-t">
              <td className="px-4 py-2">TOTAL B</td>
              {committedTotals.map((t, i) => (
                <td key={i} className="px-4 py-2 text-right">{fmt(t)}</td>
              ))}
            </tr>

            {/* ── Section C ─────────────────────────── */}
            <tr className="bg-black text-white">
              <td colSpan={6} className="px-4 py-2 font-semibold uppercase tracking-wide">
                C. Total Gap (B − A)
              </td>
            </tr>

            <tr className="bg-green-50 font-bold border-t">
              <td className="px-4 py-2">GAP</td>
              {gaps.map((gap, i) => (
                <td key={i} className={`px-4 py-2 text-right ${gap < 0 ? 'text-red-600' : 'text-black'}`}>
                  {fmt(gap)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Comments Block (only rendered if any comments exist) ────── */}
      {hasAnyComments && (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 text-xs space-y-3">
          <p className="font-semibold text-gray-600 uppercase tracking-wide text-[10px]">
            Notes &amp; Comments
          </p>

          {/* Program requirement comments */}
          {requirementsWithComments.map((req, i) => (
            <div key={`req-${i}`} className="flex gap-2">
              <span className="shrink-0 font-semibold text-gray-700 min-w-[160px]">
                {req.name || 'Program'}:
              </span>
              <span className="text-gray-600 leading-relaxed">{req.comments}</span>
            </div>
          ))}

          {/* Divider only when both types exist */}
          {requirementsWithComments.length > 0 && committedWithComments.length > 0 && (
            <hr className="border-gray-200" />
          )}

          {/* Committed fund comments */}
          {committedWithComments.map((fund, i) => (
            <div key={`fund-${i}`} className="flex gap-2">
              <span className="shrink-0 font-semibold text-gray-700 min-w-[160px]">
                {fund.name}:
              </span>
              <span className="text-gray-600 leading-relaxed">{fund.comments}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Tool2OverviewSection;