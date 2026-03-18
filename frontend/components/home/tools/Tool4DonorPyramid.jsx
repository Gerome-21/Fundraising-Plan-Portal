import React, { useState, useRef } from "react";

const HEAT_CONFIG = {
  HOT: {
    label: "HOT",
    sub: "3 C's",
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-900",
    badgeBg: "bg-red-400",
    badgeText: "text-red-900",
    dot: "bg-red-500",
    countBg: "bg-red-400",
    countText: "text-red-900",
    filterBg: "bg-red-50",
    filterBorder: "border-red-400",
    filterText: "text-red-900",
  },
  WARM: {
    label: "WARM",
    sub: "2 to 1 C's",
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-900",
    badgeBg: "bg-yellow-200",
    badgeText: "text-yellow-900",
    dot: "bg-orange-500",
    countBg: "bg-yellow-200",
    countText: "text-yellow-900",
    filterBg: "bg-yellow-50",
    filterBorder: "border-yellow-400",
    filterText: "text-yellow-900",
  },
  COLD: {
    label: "COLD",
    sub: "1 to 0 C's",
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-900",
    badgeBg: "bg-blue-200",
    badgeText: "text-blue-900",
    dot: "bg-blue-500",
    countBg: "bg-blue-200",
    countText: "text-blue-900",
    filterBg: "bg-blue-50",
    filterBorder: "border-blue-400",
    filterText: "text-blue-900",
  },
};

const HEAT_ORDER = ["HOT", "WARM", "COLD"];
const LEVEL_ORDER = ["HIGH", "MEDIUM", "LOW"];

const INITIAL_DONORS = [
  { id: 1, name: "Angela Reyes", level: "HIGH", heat: "HOT", connection: true, capability: true, concern: true},
  // { id: 2, name: "Marco Santos", level: "HIGH", heat: "WARM", connection: true, capability: true, concern: false},
  // { id: 3, name: "Lena Cruz", level: "MEDIUM", heat: "HOT", connection: true, capability: false, concern: true},
  // { id: 4, name: "David Kim", level: "MEDIUM", heat: "COLD", connection: false, capability: true, concern: false},
  // { id: 5, name: "Sofia Mendoza", level: "LOW", heat: "WARM", connection: true, capability: false, concern: false},
];

const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const CIcon = ({ active }) => (
  <span
    className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-semibold flex-shrink-0 border-[1.5px] ${
      active ? "bg-[#001033] text-white border-[#001033]" : "bg-transparent text-gray-400 border-gray-300"
    }`}
  >
    C
  </span>
);

const DonorCard = ({ donor, onEdit, onDelete }) => {
  const hc = HEAT_CONFIG[donor.heat];
  const cs = [donor.connection, donor.capability, donor.concern];
  return (
    <div
      className={`${hc.bg} border ${hc.border} rounded-xl p-2 flex flex-col gap-1 cursor-pointer transition-transform duration-150 hover:scale-[1.02]`}
      onClick={() => onEdit(donor)}
    >
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full ${hc.badgeBg} flex items-center justify-center text-[10px] font-bold ${hc.badgeText} flex-shrink-0`}>
          {getInitials(donor.name)}
        </div>
        <span className={`text-xs font-semibold ${hc.text} flex-1 leading-tight`}>
          {donor.name}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(donor.id); }}
          className="bg-transparent border-none cursor-pointer text-gray-400 text-sm leading-none px-0.5 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="flex gap-1 pl-0.5">
        {["Con", "Cap", "Concern"].map((label, i) => (
          <div key={label} className="flex items-center gap-0.5">
            <CIcon active={cs[i]} />
            <span className={`text-[9px] ${hc.text} opacity-70`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Modal = ({ donor, onSave, onClose }) => {
  const [form, setForm] = useState(
    donor || { name: "", level: "MEDIUM", heat: "WARM", connection: false, capability: false, concern: false}
  );

  const set = (k, v) =>
    setForm((f) => {
      const next = { ...f, [k]: v };
      const count = [
        k === "connection" ? v : next.connection,
        k === "capability" ? v : next.capability,
        k === "concern" ? v : next.concern,
      ].filter(Boolean).length;
      next.heat = count === 3 ? "HOT" : count >= 1 ? "WARM" : "COLD";
      return next;
    });

  const hc = HEAT_CONFIG[form.heat];

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,16,51,0.45)] flex items-center justify-center z-[1000] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,16,51,0.18)]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-lg font-bold text-[#001033]">
            {donor?.id ? "Edit Donor" : "Add Donor"}
          </h3>
          <button onClick={onClose} className="bg-transparent border-none text-[22px] cursor-pointer text-gray-500 leading-none">
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Donor Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none text-gray-900 focus:border-[#001033] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Giving Level</label>
            <div className="flex gap-2">
              {LEVEL_ORDER.map((l) => (
                <button
                  key={l}
                  onClick={() => set("level", l)}
                  className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 border-2 ${
                    form.level === l
                      ? "bg-[#001033] text-white border-[#001033]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">The Three C's</label>
            <div className="flex flex-col gap-2">
              {[
                { key: "connection", label: "Connection", desc: "Relationship with your org" },
                { key: "capability", label: "Capability", desc: "Financial ability to give" },
                { key: "concern", label: "Concern", desc: "Passion for your mission" },
              ].map(({ key, label, desc }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 border-[1.5px] ${
                    form[key] ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-[#001033]"
                  />
                  <div>
                    <p className="m-0 text-[13px] font-semibold text-gray-900">{label}</p>
                    <p className="m-0 text-[11px] text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={`px-3.5 py-2.5 ${hc.bg} border-[1.5px] ${hc.border} rounded-lg flex items-center gap-2.5`}>
            <div className={`w-2.5 h-2.5 rounded-full ${hc.dot} flex-shrink-0`} />
            <div>
              <p className={`m-0 text-xs font-bold ${hc.text}`}>Auto-classified: {form.heat}</p>
              <p className={`m-0 text-[11px] ${hc.text} opacity-80`}>{hc.sub} — based on C's checked</p>
            </div>
          </div>

          <div className="flex gap-2.5 mt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-[1.5px] border-gray-200 rounded-lg bg-white text-gray-500 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => form.name.trim() && onSave(form)}
              className={`flex-[2] py-3 border-none rounded-lg text-white text-sm font-bold transition-colors duration-150 ${
                form.name.trim() ? "bg-[#001033] cursor-pointer hover:bg-[#002060]" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {donor?.id ? "Save Changes" : "Add Donor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PYRAMID_WIDTHS = { HIGH: "w-3/5", MEDIUM: "w-4/5", LOW: "w-full" };

const Tool4DonorPyramid = () => {
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [showModal, setShowModal] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [filterHeat, setFilterHeat] = useState(null);
  const nextId = useRef(100);

  const getCell = (level, heat) => donors.filter((d) => d.level === level && d.heat === heat);
  const countByHeat = (heat) => donors.filter((d) => d.heat === heat).length;
  const countByLevel = (level) => donors.filter((d) => d.level === level).length;

  const handleSave = (form) => {
    if (editDonor?.id) {
      setDonors((prev) => prev.map((d) => (d.id === editDonor.id ? { ...form, id: d.id } : d)));
    } else {
      setDonors((prev) => [...prev, { ...form, id: nextId.current++ }]);
    }
    setShowModal(false);
    setEditDonor(null);
  };

  const handleEdit = (donor) => { setEditDonor(donor); setShowModal(true); };
  const handleDelete = (id) => setDonors((prev) => prev.filter((d) => d.id !== id));

  const stats = [
    { label: "Total Donors", value: donors.length, color: "text-[#001033]", bg: "bg-indigo-50" },
    { label: "HOT", value: countByHeat("HOT"), color: "text-red-700", bg: "bg-red-50" },
    { label: "WARM", value: countByHeat("WARM"), color: "text-yellow-800", bg: "bg-yellow-50" },
    { label: "COLD", value: countByHeat("COLD"), color: "text-blue-900", bg: "bg-blue-50" },
    { label: "HIGH Level", value: countByLevel("HIGH"), color: "text-emerald-800", bg: "bg-emerald-50" },
    { label: "MEDIUM", value: countByLevel("MEDIUM"), color: "text-indigo-700", bg: "bg-indigo-50" },
    { label: "LOW Level", value: countByLevel("LOW"), color: "text-gray-500", bg: "bg-gray-100" },
  ];

  return (
    <div className="font-sans text-gray-900 max-w-[960px] mx-auto px-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[#001033] tracking-tight">
            Tool 4: Potential Donor Pyramid
          </h2>
          <p className="mt-1 mb-0 text-[13px] text-gray-500">

          </p>
        </div>
        <button
          onClick={() => { setEditDonor(null); setShowModal(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#001033] text-white border-none rounded-xl text-[13px] font-bold cursor-pointer hover:bg-[#002060] transition-colors whitespace-nowrap"
        >
          <span className="text-base leading-none">+</span> Add Donor
        </button>
      </div>

      {/* Summary Stats */}
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

      {/* Heat filter */}
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
                  ? `${hc.filterBg} ${hc.filterBorder} ${hc.filterText}`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {hc.label} — {hc.sub}
            </button>
          );
        })}
      </div>

      {/* Pyramid Grid */}
      <div className="flex flex-col items-center">
        {/* Column Headers */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 w-full mb-2">
          <div />
          {HEAT_ORDER.map((h) => {
            const hc = HEAT_CONFIG[h];
            return (
              <div key={h} className="text-center">
                <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${hc.bg} border-[1.5px] ${hc.border} rounded-full text-xs font-bold ${hc.text}`}>
                  <div className={`w-[7px] h-[7px] rounded-full ${hc.dot}`} />
                  {hc.label}
                  <span className="font-normal opacity-70">{hc.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {LEVEL_ORDER.map((level, li) => (
          <div key={level} className={`${PYRAMID_WIDTHS[level]} ${li === 0 ? "mx-auto" : ""} transition-all duration-300`}>
            <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 items-start mb-2">
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
                      isFiltered ? "bg-gray-50 border-gray-200 opacity-40" : `${hc.bg} ${hc.border}`
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
                      <DonorCard key={d.id} donor={d} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}

                    {!isFiltered && (
                      <button
                        onClick={() => {
                          setEditDonor({ level, heat, connection: heat === "HOT", capability: heat !== "COLD", concern: heat === "HOT" });
                          setShowModal(true);
                        }}
                        className={`py-1.5 bg-transparent border-[1.5px] border-dashed ${hc.border} rounded-lg ${hc.text} text-xs font-semibold cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-150`}
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

        {/* Pyramid base */}
        <svg width="100%" height="24" viewBox="0 0 300 24" className="max-w-[960px] -mt-1">
          <polygon points="150,2 0,22 300,22" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-5 px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <h3 className="text-sm font-semibold text-gray-700">Three C's:</h3>
        {/* {[
          { label: "Connection", desc: "Relationship with your organization" },
          { label: "Capability", desc: "Financial ability to give" },
          { label: "Concern", desc: "Passion for your cause" },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-center gap-1.5">
            <CIcon active={true} />
            <span className="text-xs text-gray-700 font-semibold">{label}</span>
            <span className="text-[11px] text-gray-400">{desc}</span>
          </div>
        ))} */}
        <p className="text-sm">Identify the different donors (both current and potential) for your Organization. Classify them into HIGH, MEDIUM, and LOW-LEVEL givers, then HOT, WARM, and COLD according to the three Cs – Connection, Capability, and Concern. Plot them on the triangle below.</p>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          donor={editDonor?.id ? editDonor : editDonor && !editDonor.id ? editDonor : null}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditDonor(null); }}
        />
      )}
    </div>
  );
};

export default Tool4DonorPyramid;