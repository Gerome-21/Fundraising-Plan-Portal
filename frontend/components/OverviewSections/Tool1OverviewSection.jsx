// components/OverviewSections/Tool1OverviewSection.jsx
import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const swotConfig = [
  { key: 'strengths',    label: 'Strengths',    bg: 'bg-green-50',  text: 'text-green-700',  badge: 'S' },
  { key: 'weaknesses',   label: 'Weaknesses',   bg: 'bg-red-50',    text: 'text-red-700',    badge: 'W' },
  { key: 'opportunities',label: 'Opportunities', bg: 'bg-blue-50',   text: 'text-blue-700',   badge: 'O' },
  { key: 'threats',      label: 'Threats',      bg: 'bg-orange-50', text: 'text-orange-700', badge: 'T' },
];

const Tool1OverviewSection = ({ swotData, chart, chartData }) => {
  const hasFlowChart = chartData?.nodes?.length > 0;

  return (
    <section className="mb-10">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">
        Tool 1 — Self Assessment
      </h3>

      {/* SWOT */}
      <h4 className="font-medium text-sm text-gray-600 mb-3">SWOT Analysis</h4>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {swotConfig.map(({ key, label, bg, text, badge }) => (
          <div key={key} className={`${bg} border rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-[#121212] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {badge}
              </div>
              <h5 className={`font-semibold text-sm ${text}`}>{label}</h5>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {swotData[key] || <span className="text-gray-400 italic">No data entered</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Org Chart */}
      <h4 className="font-medium text-sm text-gray-600 mb-3">Organizational Structure</h4>
      {hasFlowChart ? (
        // NOTE: ReactFlow doesn't render well in html2canvas.
        // For PDF export, consider capturing this section as a screenshot
        // before generating the PDF, or swap to a static SVG render.
        <div className="border rounded-xl overflow-hidden h-64 bg-gray-50">
          <ReactFlow
            nodes={chartData.nodes}
            edges={chartData.edges.map(e => ({
              ...e, type: 'smoothstep',
              style: { stroke: '#6ea686', strokeWidth: 2 }
            }))}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
          >
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      ) : chart?.image_url ? (
        <div className="border rounded-xl overflow-hidden bg-gray-50 p-4">
          <img
            src={chart.image_url}
            alt="Organizational Chart"
            className="w-full h-auto max-h-64 object-contain"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No organizational chart uploaded
        </div>
      )}
    </section>
  );
};

export default Tool1OverviewSection;