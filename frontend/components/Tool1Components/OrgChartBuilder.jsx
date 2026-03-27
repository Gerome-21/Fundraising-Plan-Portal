import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import { FiSave, FiPlus, FiTrash2, FiUpload, FiGrid, FiMaximize2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Executive Director' },
    position: { x: 250, y: 0 },
    style: { background: '#22864D', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '2',
    data: { label: 'Program Manager' },
    position: { x: 100, y: 100 },
    style: { background: '#f0fdf4', border: '2px solid #22864D', borderRadius: '8px', padding: '10px' }
  },
  {
    id: '3',
    data: { label: 'Resource Mobilization' },
    position: { x: 400, y: 100 },
    style: { background: '#f0fdf4', border: '2px solid #22864D', borderRadius: '8px', padding: '10px' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#22864D', strokeWidth: 2 }, type:'smoothstep' },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#22864D', strokeWidth: 2 }, type:'smoothstep' },
];

const OrgChartBuilder = ({ onSave, onClose, initialData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const onConnect = useCallback((params) => 
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22864D', strokeWidth: 2 }
    }, eds)), 
  [setEdges]);


  const addNode = () => {
    if (!nodeName.trim()) {
      toast.error('Please enter a node name');
      return;
    }

    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      data: { label: nodeName },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 150 },
      style: { background: '#f0fdf4', border: '2px solid #22864D', borderRadius: '8px', padding: '10px' }
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
    toast.success('Node added');
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      toast.success('Node deleted');
    } else {
      toast.error('Select a node first');
    }
  };

  const clearCanvas = () => {
    if (window.confirm('Clear all nodes and edges?')) {
      setNodes([]);
      setEdges([]);
      toast.success('Canvas cleared');
    }
  };

  const handleSave = async () => {
    if (nodes.length === 0) {
      toast.error('Please add at least one node');
      return;
    }

    setIsSaving(true);
    const chartData = {
      nodes: nodes.map(node => ({
        id: node.id,
        data: node.data,
        position: node.position,
        style: node.style,
        type: node.type || 'default'
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        animated: edge.animated,
        style: edge.style
      }))
    };
    
    await onSave(chartData);
    setIsSaving(false);
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const downloadAsImage = () => {
    if (!reactFlowInstance) return;
    
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;
    
    toast.loading('Generating image...');
    
    // Use html2canvas if available, or just show message
    toast.dismiss();
    toast.success('Click "Save" to persist your chart');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-[#001033]">Organization Chart Builder</h3>
            <p className="text-xs text-gray-500 mt-1">Drag nodes to position, connect them to show relationships</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 flex-wrap">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter node name (e.g., Finance Manager)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#22864D] focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
            />
          </div>
          <button
            onClick={addNode}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#22864D] text-white rounded-lg text-sm hover:bg-[#1a6b3c] transition"
          >
            <FiPlus size={14} /> Add Node
          </button>
          <button
            onClick={deleteSelectedNode}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
          >
            <FiTrash2 size={14} /> Delete Selected
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
          >
            <FiTrash2 size={14} /> Clear All
          </button>
          <div className="flex-1"></div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1 px-4 py-1.5 bg-[#22864D] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6b3c] transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiSave size={14} />
            {isSaving ? 'Saving...' : 'Save Chart'}
          </button>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 bg-gray-100">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            fitView
            attributionPosition="bottom-right"
          >
            <MiniMap 
              nodeStrokeWidth={3}
              nodeColor={(node) => {
                if (node.type === 'input') return '#22864D';
                return '#a2d5b1';
              }}
            />
            <Controls />
            <Background color="#aaa" gap={16} />
            <Panel position="top-right">
              <div className="bg-white/90 backdrop-blur rounded-lg p-2 text-xs text-gray-500 shadow">
                {nodes.length} nodes | {edges.length} connections
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Instructions */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex gap-4">
          <span>✨ Click on nodes to select them</span>
          <span>🔗 Drag from node handle to connect</span>
          <span>🖱️ Drag nodes to reposition</span>
          <span>🔍 Scroll to zoom in/out</span>
        </div>
      </div>
    </div>
  );
};

export default OrgChartBuilder;