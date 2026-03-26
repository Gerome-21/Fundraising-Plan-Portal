import React from "react";
import { FiSave } from "react-icons/fi";

const SwotAnalysis = ({ swotData, handleSwotChange, handleSaveSwot, loading }) => {
  return (
    <section className="mb-8 pt-8 border-t-1 border-gray-400">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[#121212]">SWOT Analysis</h3>
        <button
          onClick={handleSaveSwot}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#22864D]/90 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiSave className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">S</div>
            <h4 className="font-semibold">Strengths</h4>
          </div>
          <textarea
            name="strengths"
            value={swotData.strengths}
            onChange={handleSwotChange}
            rows="6"
            placeholder="What are your organization's strengths in fund raising?"
            className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition text-sm"
          />
        </div>

        <div className="bg-red-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">W</div>
            <h4 className="font-semibold">Weaknesses</h4>
          </div>
          <textarea
            name="weaknesses"
            value={swotData.weaknesses}
            onChange={handleSwotChange}
            rows="6"
            placeholder="What internal challenges or weaknesses exist?"
            className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition text-sm"
          />
        </div>

        <div className="bg-blue-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">O</div>
            <h4 className="font-semibold">Opportunities</h4>
          </div>
          <textarea
            name="opportunities"
            value={swotData.opportunities}
            onChange={handleSwotChange}
            rows="6"
            placeholder="What external opportunities exist for fund raising?"
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition text-sm"
          />
        </div>

        <div className="bg-orange-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">T</div>
            <h4 className="font-semibold">Threats</h4>
          </div>
          <textarea
            name="threats"
            value={swotData.threats}
            onChange={handleSwotChange}
            rows="6"
            placeholder="What external threats could impact fund raising?"
            className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition text-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default SwotAnalysis;