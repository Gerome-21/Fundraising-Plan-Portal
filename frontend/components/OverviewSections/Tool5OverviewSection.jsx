// components/OverviewSections/Tool5OverviewSection.jsx
import React from 'react';

const CATEGORY_STYLES = {
  current:   { label: "Current",   bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200"  },
  former:    { label: "Former",    bg: "bg-gray-50",  text: "text-gray-600",  border: "border-gray-200"  },
  potential: { label: "Potential", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
};

const DONOR_TYPE_LABELS = {
  members:    "Members",
  corporates: "Corporates",
  hnwi:       "High Net Worth",
};

const SECTIONS = [
  { id: "awareness", title: "Raise Awareness",},
  { id: "interest",  title: "Capture Their Interest", },
  { id: "action",    title: "Call to Action",},
  { id: "benefits",  title: "Benefits",},
];

const DONOR_TYPES      = ["members", "corporates", "hnwi"];
const DONOR_CATEGORIES = ["current", "former", "potential"];

// ── Single section table ───────────────────────────────────────────────────
const SectionTable = ({ section, sectionData }) => {
  const hasAnyValue = DONOR_CATEGORIES.some(cat =>
    DONOR_TYPES.some(dt => Number(sectionData?.[cat]?.[dt]) > 0)
  );

  return (
    <div className="mb-5 rounded-xl border overflow-hidden">

      {/* Section header */}
      <div className={`bg-gray-600 px-4 py-2.5 flex items-center gap-2`}>
        <span className="text-white text-xs font-bold uppercase tracking-widest">
          {section.title}
        </span>
      </div>

      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-gray-500 font-semibold w-28">Category</th>
            {DONOR_TYPES.map(dt => (
              <th key={dt} className="px-4 py-2 text-center text-gray-500 font-semibold">
                {DONOR_TYPE_LABELS[dt]}
              </th>
            ))}
            <th className="px-4 py-2 text-center text-gray-500 font-semibold">Row Total</th>
          </tr>
        </thead>

        <tbody>
          {DONOR_CATEGORIES.map((cat, i) => {
            const style    = CATEGORY_STYLES[cat];
            const rowTotal = DONOR_TYPES.reduce((s, dt) => s + (Number(sectionData?.[cat]?.[dt]) || 0), 0);

            return (
              <tr key={cat} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                    {style.label}
                  </span>
                </td>
                {DONOR_TYPES.map(dt => {
                  const val = Number(sectionData?.[cat]?.[dt]) || 0;
                  return (
                    <td key={dt} className="px-4 py-2 text-center">
                      {val > 0
                        ? <span className="font-semibold text-gray-800">{val}</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                  );
                })}
                <td className="px-4 py-2 text-center">
                  {rowTotal > 0
                    ? <span className="font-bold text-[#001033]">{rowTotal}</span>
                    : <span className="text-gray-300">—</span>
                  }
                </td>
              </tr>
            );
          })}

          {/* Column totals footer */}
          <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
            <td className="px-4 py-2 text-xs text-gray-600 uppercase tracking-wide">Total</td>
            {DONOR_TYPES.map(dt => {
              const colTotal = DONOR_CATEGORIES.reduce((s, cat) =>
                s + (Number(sectionData?.[cat]?.[dt]) || 0), 0);
              return (
                <td key={dt} className="px-4 py-2 text-center text-gray-800">
                  {colTotal > 0 ? colTotal : <span className="text-gray-300 font-normal">—</span>}
                </td>
              );
            })}
            {/* Grand total for this section */}
            <td className="px-4 py-2 text-center text-[#22864D]">
              {DONOR_CATEGORIES.reduce((s, cat) =>
                s + DONOR_TYPES.reduce((s2, dt) => s2 + (Number(sectionData?.[cat]?.[dt]) || 0), 0), 0
              ) || <span className="text-gray-300 font-normal">—</span>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ── Cross-section summary ──────────────────────────────────────────────────
const SummaryTable = ({ summary, grandTotal }) => (
  <div className="mt-6 rounded-xl border overflow-hidden">
    <div className="bg-[#001033] px-4 py-2.5">
      <span className="text-white text-xs font-bold uppercase tracking-widest">
        Summary Across All Sections
      </span>
    </div>

    <table className="w-full text-xs">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-2 text-left text-gray-500 font-semibold w-28">Category</th>
          {DONOR_TYPES.map(dt => (
            <th key={dt} className="px-4 py-2 text-center text-gray-500 font-semibold">
              {DONOR_TYPE_LABELS[dt]}
            </th>
          ))}
          <th className="px-4 py-2 text-center text-gray-500 font-semibold">Subtotal</th>
        </tr>
      </thead>

      <tbody>
        {DONOR_CATEGORIES.map((cat, i) => {
          const style    = CATEGORY_STYLES[cat];
          const rowTotal = DONOR_TYPES.reduce((s, dt) => s + (summary?.[cat]?.[dt] || 0), 0);

          return (
            <tr key={cat} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-4 py-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                  {style.label}
                </span>
              </td>
              {DONOR_TYPES.map(dt => (
                <td key={dt} className="px-4 py-2 text-center">
                  {summary?.[cat]?.[dt] > 0
                    ? <span className="font-semibold text-gray-800">{summary[cat][dt]}</span>
                    : <span className="text-gray-300">—</span>
                  }
                </td>
              ))}
              <td className="px-4 py-2 text-center font-bold text-[#001033]">
                {rowTotal > 0 ? rowTotal : <span className="text-gray-300 font-normal">—</span>}
              </td>
            </tr>
          );
        })}

        {/* Grand total row */}
        <tr className="bg-[#22864D]/10 border-t-2 border-[#22864D]/30 font-bold">
          <td className="px-4 py-2.5 text-[#22864D] uppercase tracking-wide text-[10px]">Grand Total</td>
          {DONOR_TYPES.map(dt => {
            const colTotal = DONOR_CATEGORIES.reduce((s, cat) => s + (summary?.[cat]?.[dt] || 0), 0);
            return (
              <td key={dt} className="px-4 py-2.5 text-center text-[#22864D]">
                {colTotal > 0 ? colTotal : <span className="text-gray-300 font-normal">—</span>}
              </td>
            );
          })}
          <td className="px-4 py-2.5 text-center text-lg font-extrabold text-[#22864D]">
            {grandTotal || <span className="text-gray-300 text-xs font-normal">—</span>}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// ── Main export ────────────────────────────────────────────────────────────
const Tool5OverviewSection = ({ rawData, summary, grandTotal }) => {
  if (!rawData || grandTotal === 0) {
    return (
      <section className="mb-10">
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">
          Tool 5 — Key Messages and Communications
        </h3>
        <p className="text-sm text-gray-400 italic">No key messages data entered yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">
        Tool 5 — Key Messages and Communications
      </h3>

      {/* One table per section */}
      {SECTIONS.map(section => (
        <SectionTable
          key={section.id}
          section={section}
          sectionData={rawData?.[section.id] || {}}
        />
      ))}

      {/* Cross-section summary */}
      <SummaryTable summary={summary} grandTotal={grandTotal} />
    </section>
  );
};

export default Tool5OverviewSection;