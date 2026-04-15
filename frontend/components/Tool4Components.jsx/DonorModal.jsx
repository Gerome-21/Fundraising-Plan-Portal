import React, { useState } from "react";
import { HEAT_CONFIG, LEVEL_ORDER } from "./heatConfig";
import { FiHeart, FiTarget, FiDollarSign } from "react-icons/fi";
import { MdHandshake } from "react-icons/md";

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

  const toggleC = (key) => {
    set(key, !form[key]);
  };

  const hc = HEAT_CONFIG[form.heat];

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,16,51,0.45)] flex items-center justify-center z-[1000] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-[600px] shadow-[0_20px_60px_rgba(0,16,51,0.18)]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-lg font-bold text-[#001033]">
            {donor?.id ? "Edit Donor" : "Add Donor"}
          </h3>
          <button onClick={onClose} className="bg-transparent border-none text-[22px] cursor-pointer text-gray-500 leading-none hover:text-gray-700">
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
              className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none text-gray-900 focus:border-[#22864D] transition-colors"
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
                      ? "bg-[#22864D] text-white border-[#22864D]"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: "connection", label: "Connection", desc: "Relationship with your org", icon: <MdHandshake className="w-6 h-6" /> },
                { key: "capability", label: "Capability", desc: "Financial ability to give", icon: <FiDollarSign className="w-6 h-6" /> },
                { key: "concern",    label: "Concern",    desc: "Passion for your mission",  icon: <FiHeart className="w-6 h-6" /> },
              ].map(({ key, label, desc, icon }) => (
                <button
                  key={key}
                  onClick={() => toggleC(key)}
                  type="button"
                  className={`flex flex-col items-center text-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-150 border-2 ${
                    form[key] 
                      ? "bg-[#40F58E]/20 border-[#22864D] shadow-md scale-[1.02]" 
                      : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className={`transition-colors duration-150 ${
                    form[key] ? "animate-pulse " : "text-gray-500"
                  }`}>
                    {icon}
                  </div>
                  <div>
                    <p className={`m-0 text-[13px] font-semibold transition-colors duration-150 ${
                      form[key] ? "text-[#22864D]" : "text-gray-900"
                    }`}>
                      {label}
                    </p>
                    <p className="m-0 text-[11px] text-gray-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`px-3.5 py-2.5 ${hc.bg} border-[1.5px] ${hc.filterBorder} rounded-lg flex items-center gap-2.5`}>
            <div className={`w-2.5 h-2.5 rounded-full ${hc.dot} flex-shrink-0 animate-pulse`} />
            <div>
              <p className={`m-0 text-xs font-bold ${hc.textCs}`}>Auto-classified: {form.heat}</p>
              <p className={`m-0 text-[11px] ${hc.textCs} opacity-80`}>{hc.sub} — based on C's checked</p>
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
                  ? "bg-[#22864D] cursor-pointer hover:bg-[#1a6b3c]"
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