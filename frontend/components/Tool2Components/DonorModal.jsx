import React, { useState } from "react";
import { HEAT_CONFIG, LEVEL_ORDER } from "./heatConfig";

const deriveHeat = (connection, capability, concern) => {
  const count = [connection, capability, concern].filter(Boolean).length;
  return count === 3 ? "HOT" : count >= 1 ? "WARM" : "COLD";
};

export const DonorModal = ({ donor, defaultLevel, defaultHeat, saving, onSave, onClose }) => {
  const [form, setForm] = useState(
    donor?.id
      ? { ...donor }
      : {
          name: "",
          level: defaultLevel || "MEDIUM",
          heat: defaultHeat || "WARM",
          connection: defaultHeat === "HOT",
          capability: defaultHeat !== "COLD",
          concern: defaultHeat === "HOT",
        }
  );

  const set = (k, v) =>
    setForm((f) => {
      const next = { ...f, [k]: v };
      const conn = k === "connection" ? v : next.connection;
      const cap  = k === "capability"  ? v : next.capability;
      const con  = k === "concern"     ? v : next.concern;
      next.heat = deriveHeat(conn, cap, con);
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

          <div className={`px-3.5 py-2.5 ${hc.bg} border-[1.5px] ${hc.filterBorder} rounded-lg flex items-center gap-2.5`}>
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
              disabled={saving}
              className={`flex-[2] py-3 border-none rounded-lg text-white text-sm font-bold transition-colors duration-150 ${
                form.name.trim() && !saving
                  ? "bg-[#001033] cursor-pointer hover:bg-[#002060]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving…" : donor?.id ? "Save Changes" : "Add Donor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};