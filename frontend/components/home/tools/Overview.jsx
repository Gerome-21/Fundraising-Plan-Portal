import React from "react";

const Overview = () => {
  return (
    <div className="bg-white text-[#001033] p-8 max-w-5xl mx-auto">

      {/* ===== HEADER / COVER ===== */}
      <div className="text-center border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold">
          Organization Name
        </h1>

        <h2 className="text-xl mt-2 font-semibold">
          Fundraising Plan Report
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Prepared by: Authorized NGO / User Name
        </p>

        <p className="text-xs text-gray-500">
          Date Generated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* ===== EXECUTIVE SUMMARY ===== */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">
          Executive Summary
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          This report summarizes the organization’s fundraising plan based on
          the completed planning tools. It highlights key strategies, financial
          projections, and organizational insights to support effective
          decision-making and implementation.
        </p>
      </div>

      {/* ===== KEY METRICS ===== */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">
          Key Metrics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Target Funds</p>
            <p className="font-bold text-lg">₱ 0.00</p>
          </div>

          <div className="border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Total Budget</p>
            <p className="font-bold text-lg">₱ 0.00</p>
          </div>

          <div className="border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Activities</p>
            <p className="font-bold text-lg">0</p>
          </div>

          <div className="border rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-bold text-lg">0 Months</p>
          </div>
        </div>
      </div>

      {/* ===== INSIGHTS ===== */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">
          Key Insights
        </h3>

        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
          <li>Most funds are allocated to operational costs</li>
          <li>Limited fundraising activities may affect target achievement</li>
          <li>Opportunity to improve donor engagement strategies</li>
        </ul>
      </div>

      {/* ===== PAGE BREAK LABEL ===== */}
      <div className="text-center text-xs text-gray-400 my-6">
        Tool 1 Summary — Self Assessment
      </div>

      {/* ===== TOOL 1: SWOT SUMMARY ===== */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">
          SWOT Analysis Summary
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="border rounded-xl p-4 bg-green-50">
            <h4 className="font-semibold text-green-700 mb-1">Strengths</h4>
            <p className="text-sm text-gray-700">
              Summary of key strengths...
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-red-50">
            <h4 className="font-semibold text-red-700 mb-1">Weaknesses</h4>
            <p className="text-sm text-gray-700">
              Summary of weaknesses...
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-blue-50">
            <h4 className="font-semibold text-blue-700 mb-1">Opportunities</h4>
            <p className="text-sm text-gray-700">
              Summary of opportunities...
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-yellow-50">
            <h4 className="font-semibold text-yellow-700 mb-1">Threats</h4>
            <p className="text-sm text-gray-700">
              Summary of threats...
            </p>
          </div>

        </div>
      </div>

      {/* ===== TOOL 1: ORG STRUCTURE ===== */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">
          Organizational Structure
        </h3>

        <div className="border rounded-xl h-56 flex items-center justify-center bg-gray-50">
          <span className="text-gray-400 text-sm">
            Organizational Chart Preview
          </span>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center text-xs text-gray-400 mt-10">
        End of Overview — Detailed planning tools follow in the next sections
      </div>

    </div>
  );
};

export default Overview;
