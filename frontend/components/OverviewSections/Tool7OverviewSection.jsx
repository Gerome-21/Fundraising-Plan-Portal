// components/OverviewSections/Tool7OverviewSection.jsx
import React from 'react';

// ── Single policy item ─────────────────────────────────────────────────────
const PolicyItem = ({ label, value }) => {
  const isEmpty = !value?.trim();

  return (
    <div className="border-l-4 border-[#22864D]/50 bg-gray-50 rounded-r-lg px-5 py-4">
      {/* Prompt label */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#001033] mb-1.5 opacity-70">
        {label}
      </p>

      {/* User's answer */}
      {isEmpty ? (
        <p className="text-sm text-gray-400 italic">No response provided.</p>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
};

// ── Main export ────────────────────────────────────────────────────────────
const Tool7OverviewSection = ({ formData, fields }) => {
  const hasAnyContent = fields.some(f => formData?.[f.key]?.trim());

  if (!hasAnyContent) {
    return (
      <section className="mb-10">
        <h3 className="font-semibold text-lg mb-4 border-b border-gray-200 pb-2">
          Tool 7 — Fundraising Policies
        </h3>
        <p className="text-sm text-gray-400 italic">No policy data entered yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h3 className="font-semibold text-lg mb-4 border-b border-gray-200 pb-2">
        Tool 7 — Fundraising Policies
      </h3>

      <div className="space-y-3">
        {fields.map(({ key, label }) => (
          <PolicyItem
            key={key}
            label={label}
            value={formData?.[key]}
          />
        ))}
      </div>
    </section>
  );
};

export default Tool7OverviewSection;