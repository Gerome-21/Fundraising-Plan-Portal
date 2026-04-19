import React, { useState, useCallback, useEffect } from "react";
import { FiImage, FiRepeat, FiTrash2, FiGitBranch, FiEdit2, FiMaximize2 } from "react-icons/fi";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import OrgChartBuilder from "./OrgChartBuilder";

const OrganizationalStructure = ({ 
  chart, 
  uploading, 
  handleUploadChart, 
  handleDeleteChart, 
  handleSaveChartData,
  chartData 
}) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize React Flow nodes and edges for display
  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState(chartData?.nodes || []);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState(chartData?.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const hasInteractiveChart = chartData && (chartData.nodes?.length > 0);

  useEffect(() => {
    if (chartData?.nodes) setDisplayNodes(chartData.nodes);

    if (chartData?.edges) {
      const smoothEdges = chartData.edges.map(edge => ({
        ...edge,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#6ea686', strokeWidth: 2 }
      }));

      setDisplayEdges(smoothEdges);
    }
  }, [chartData]);

  
  const handleSaveBuilderData = async (data) => {
    await handleSaveChartData(data);
    setShowBuilder(false);
  };

  const handleEditChart = () => {
    setShowBuilder(true);
  };

  const handleSwitchToImage = async (e) => {
    await handleUploadChart(e);
    await handleSaveChartData({ nodes: [], edges: [] });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Display React Flow Chart
  const renderFlowChart = (isFullscreenMode = false) => (
  <div className={`${isFullscreenMode ? 'fixed inset-0 z-50 bg-white' : 'w-full'}`}>
    <div className={`relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 ${isFullscreenMode ? 'h-screen' : 'h-[500px]'}`}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={true}
      >
        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={(node) => node.type === 'input' ? '#22864D' : '#2ac871'}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
        <Panel position="top-left">
          <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-gray-500 shadow">
            {displayNodes.length} positions | {displayEdges.length} connections
          </div>
        </Panel>
      </ReactFlow>

      {!isFullscreenMode && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white p-2 rounded-lg shadow-md transition"
          title="View fullscreen"
        >
          <FiMaximize2 className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {isFullscreenMode && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition"
          title="Exit fullscreen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

  return (
    <section className="mb-8 pt-8 border-t-1 border-gray-400">
      <h3 className="font-bold text-lg mb-4">Organizational Structure</h3>
      <p className="text-sm mb-4">
        Provide a diagram of the current organizational chart, paying particular attention to the resource mobilization team and its relationships with other units. For smaller organizations, provide alternative structures that assume the responsibilities of resource mobilization.
      </p>

      {/* Action Buttons */}
     <div className="flex gap-3 mb-4">
        {hasInteractiveChart ? (
          <>
            <button
              onClick={handleEditChart}
              className="flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg text-sm font-medium hover:bg-[#1a6b3c] transition-all"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Interactive Chart
            </button>
            <label className="cursor-pointer">
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all">
                <FiImage className="w-4 h-4" />
                Switch to Image
              </span>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg"
                onChange={handleSwitchToImage}
                disabled={uploading}
              />
            </label>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Display Interactive Chart */}
      {hasInteractiveChart && !showBuilder && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Organization Chart</h4>
            <div className="flex gap-2">
              <button
                onClick={handleEditChart}
                className="text-[#22864D] hover:text-[#1a6b3c] text-sm flex items-center gap-1"
              >
                <FiEdit2 size={14} />
                Edit
              </button>
            </div>
          </div>
          {renderFlowChart()}
        </div>
      )}

      {/* Display Uploaded Image */}
      {!hasInteractiveChart && chart && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={chart.image_url}
                alt="Organizational Chart"
                className="w-full h-auto object-contain max-h-[500px]"
              />
            </div>

            <div className="flex gap-3">
              <label className="cursor-pointer">
                <span className="bg-white text-green-500 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg">
                  <FiRepeat />
                  Replace
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleUploadChart}
                  disabled={uploading}
                />
              </label>

              <button
                onClick={handleDeleteChart}
                className="bg-gray-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            {uploading && (
              <div className="mt-4 w-full bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="animate-spin h-4 w-4 text-[#22864D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State - No Chart */}
      {!hasInteractiveChart && !chart && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-[#22864D] group">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#22864D]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#22864D]/20 transition-all">
              <FiGitBranch className="w-8 h-8 text-[#22864D]" />
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">No Organization Chart Yet</h4>
            <p className="text-sm text-gray-500 mb-4">
              Create an interactive chart or upload an image
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBuilder(true)}
                className="bg-[#22864D] hover:bg-[#22864D]/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <FiGitBranch />
                Create Chart
              </button>
              <label className="cursor-pointer">
                <span className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg">
                  <FiImage />
                  Upload Image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleUploadChart}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="mt-4 text-xs text-gray-400">Max file size: 10MB</div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && hasInteractiveChart && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-[#001033]">Organization Chart - Fullscreen</h3>
              <button
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              {renderFlowChart(true)}
            </div>
          </div>
        </div>
      )}

      {/* Chart Builder Modal */}
      {showBuilder && (
        <OrgChartBuilder
          onSave={handleSaveBuilderData}
          onClose={() => setShowBuilder(false)}
          initialData={chartData}
        />
      )}
    </section>
  );
};

export default OrganizationalStructure;