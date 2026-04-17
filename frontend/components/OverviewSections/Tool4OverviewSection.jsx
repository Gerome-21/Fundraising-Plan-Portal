// components/OverviewSections/Tool4OverviewSection.jsx
import React from 'react';
import { HEAT_CONFIG } from '../Tool4Components.jsx/heatConfig';

// ── Shared constants ───────────────────────────────────────────────────────
const LEVEL_ORDER = ["HIGH", "MEDIUM", "LOW"];
const HEAT_ORDER  = ["HOT", "WARM", "COLD"];

// Pyramid row widths mirror the live tool
const PYRAMID_WIDTHS = { HIGH: "w-3/5", MEDIUM: "w-4/5", LOW: "w-full" };

// 3 C's indicator — tiny read-only pill
const CsBadge = ({ active, label }) => (
  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-semibold border
    ${active ? "bg-[#001033] text-white border-[#001033]" : "bg-transparent text-gray-400 border-gray-300"}`}>
    C
  </span>
);

const getInitials = (name) =>
  name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

// ── Read-only donor chip (no click/delete handlers) ────────────────────────
const DonorChip = ({ donor }) => {
  const hc = HEAT_CONFIG[donor.heat];
  const cs = [donor.connection, donor.capability, donor.concern];
  const labels = ["Con", "Cap", "Cnc"];

  return (
    <div className={`${hc.bg} border ${hc.filterBorder} rounded-lg p-1.5 flex flex-col gap-1`}>
      <div className="flex items-center gap-1.5">
        <div className={`w-6 h-6 rounded-full ${hc.badgeBg} flex items-center justify-center text-[9px] font-bold ${hc.badgeText} shrink-0`}>
          {getInitials(donor.name)}
        </div>
        <span className={`text-[10px] font-semibold ${hc.text} leading-tight line-clamp-1 flex-1`}>
          {donor.name}
        </span>
      </div>
      <div className="flex gap-1 pl-0.5">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-0.5">
            <CsBadge active={cs[i]} label={label} />
            <span className={`text-[8px] ${hc.text} opacity-60`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Visual pyramid grid (read-only) ───────────────────────────────────────
const PyramidOverview = ({ donorMatrix }) => (
  <div className="flex flex-col items-center gap-2 mb-8">

    {/* Column headers */}
    <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-2 w-full mb-1">
      <div />
      {HEAT_ORDER.map(heat => {
        const hc = HEAT_CONFIG[heat];
        return (
          <div key={heat} className="text-center">
            <span className={`inline-flex items-center gap-1 px-3 py-1 ${hc.bgCs} border ${hc.filterBorderCs} rounded-full text-[10px] font-bold ${hc.textCs}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hc.dot}`} />
              {hc.label}
              <span className="font-normal opacity-60 text-[9px]">{hc.sub}</span>
            </span>
          </div>
        );
      })}
    </div>

    {/* Pyramid rows */}
    {LEVEL_ORDER.map(level => {
      const cells = donorMatrix[level] || {};
      return (
        <div key={level} className={`${PYRAMID_WIDTHS[level]} w-full`}>
          <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-2">

            {/* Level label */}
            <div className="flex items-center justify-end pr-2">
              <span className="text-[10px] font-bold text-[#001033] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                {level}
              </span>
            </div>

            {/* Cells */}
            {HEAT_ORDER.map(heat => {
              const hc   = HEAT_CONFIG[heat];
              const list = cells[heat] || [];
              return (
                <div key={heat}
                  className={`min-h-[90px] border ${hc.filterBorder} rounded-xl p-2 flex flex-col gap-1.5 ${hc.bg}`}
                >
                  {/* Cell label + count */}
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-[9px] font-bold ${hc.text} opacity-50 uppercase`}>
                      {level}/{heat}
                    </span>
                    {list.length > 0 && (
                      <span className={`${hc.countBg} ${hc.countText} text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>
                        {list.length}
                      </span>
                    )}
                  </div>

                  {list.length === 0
                    ? <span className="text-[9px] text-gray-300 italic">—</span>
                    : list.map(d => <DonorChip key={d.id} donor={d} />)
                  }
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);

// ── Grouped roster table ──────────────────────────────────────────────────
// Organized by Level → Heat so the reader can scan the full list cleanly
const DonorRoster = ({ donorMatrix }) => {
  const rows = [];

  LEVEL_ORDER.forEach(level => {
    HEAT_ORDER.forEach(heat => {
      const list = (donorMatrix[level] || {})[heat] || [];
      list.forEach(d => rows.push({ ...d, level, heat }));
    });
  });

  if (rows.length === 0) return null;

  const heatLabel = { HOT: "HOT — 3 C's", WARM: "WARM — 2–1 C's", COLD: "COLD — 0–1 C's" };

  // Group rows by level
  return (
    <div className="mt-6">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        Donor Roster by Classification
      </h4>

      {LEVEL_ORDER.map(level => {
        const levelDonors = rows.filter(r => r.level === level);
        if (levelDonors.length === 0) return null;

        return (
          <div key={level} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#001033] uppercase tracking-wider">{level} Level</span>
              <span className="text-[10px] text-gray-400">({levelDonors.length} donor{levelDonors.length > 1 ? 's' : ''})</span>
            </div>

            <table className="w-full text-xs border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Donor Name</th>
                  <th className="px-3 py-2 text-center font-semibold">Heat</th>
                  <th className="px-3 py-2 text-center font-semibold">Connection</th>
                  <th className="px-3 py-2 text-center font-semibold">Capability</th>
                  <th className="px-3 py-2 text-center font-semibold">Concern</th>
                </tr>
              </thead>
              <tbody>
                {levelDonors.map((d, i) => {
                  const hc = HEAT_CONFIG[d.heat];
                  return (
                    <tr key={d.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-2 font-medium text-gray-800">{d.name}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${hc.bgCs} ${hc.textCs} border ${hc.filterBorderCs}`}>
                          {d.heat}
                        </span>
                      </td>
                      {[d.connection, d.capability, d.concern].map((val, ci) => (
                        <td key={ci} className="px-3 py-2 text-center">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold border
                            ${val ? 'bg-[#001033] text-white border-[#001033]' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            {val ? '✓' : '—'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

// ── Stats summary row ─────────────────────────────────────────────────────
const StatPill = ({ label, value, bg, text }) => (
  <div className={`${bg} rounded-lg px-3 py-2 text-center`}>
    <p className={`text-base font-bold ${text}`}>{value}</p>
    <p className={`text-[9px] font-semibold ${text} opacity-70 uppercase tracking-wide`}>{label}</p>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────
const Tool4OverviewSection = ({ donors, donorMatrix, stats }) => {
  if (!donors || donors.length === 0) {
    return (
      <section className="mb-14">
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Tool 4 — Potential Donor Pyramid</h3>
        <p className="text-sm text-gray-400 italic">No donors added yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">Tool 4 — Potential Donor Pyramid</h3>
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Objectives</h3>
        <p className="text-sm">
          Identify the different donors (both current and potential) for your Organization. 
          Classify them into HIGH, MEDIUM, and LOW-LEVEL givers, then HOT, WARM, and COLD 
          according to the three Cs – Connection, Capability, and Concern. Plot them on the triangle below.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        <StatPill label="Total"  value={stats.total}         bg="bg-emerald-800"    text="text-white" />
        <StatPill label="HOT"    value={stats.byHeat.HOT}    bg="bg-gray-200" text="text-black" />
        <StatPill label="WARM"   value={stats.byHeat.WARM}   bg="bg-gray-100"   text="text-black" />
        <StatPill label="COLD"   value={stats.byHeat.COLD}   bg="bg-gray-50"    text="text-black" />
        <StatPill label="HIGH"   value={stats.byLevel.HIGH}  bg="bg-green-200" text="text-emerald-900" />
        <StatPill label="MEDIUM" value={stats.byLevel.MEDIUM} bg="bg-green-100"  text="text-green-700" />
        <StatPill label="LOW"    value={stats.byLevel.LOW}   bg="bg-green-50"    text="text-green-500" />
      </div>

      {/* Visual pyramid */}
      <PyramidOverview donorMatrix={donorMatrix} />

      {/* Grouped roster table — always readable in print/PDF */}
      <DonorRoster donorMatrix={donorMatrix} />
    </section>
  );
};

export default Tool4OverviewSection;