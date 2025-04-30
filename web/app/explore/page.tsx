'use client';

//pages/explorer.tsx
import { useState, useEffect } from 'react';
import BlockchainGraph from '../../components/graph';

// Mock data generator (replace with your actual API calls)
function generateMockData(nodeCount = 20) {
  const types = ['contract', 'wallet', 'token', 'nft', 'pda'];
  const edgeTypes = ['transfer', 'ownership', 'interaction', 'transaction'];
  
  // Generate nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    type: types[Math.floor(Math.random() * types.length)] as 'contract' | 'wallet' | 'token' | 'nft' | 'pda',
    label: `${types[Math.floor(Math.random() * types.length)]}-${i}`,
    data: { balance: Math.floor(Math.random() * 1000) }
  }));
  
  // Generate edges (connections between nodes)
  const edges = [];
  for (let i = 0; i < nodeCount * 1.5; i++) {
    const source = nodes[Math.floor(Math.random() * nodes.length)].id;
    let target;
    do {
      target = nodes[Math.floor(Math.random() * nodes.length)].id;
    } while (source === target);
    
    edges.push({
      id: `edge-${i}`,
      source,
      target,
      type: edgeTypes[Math.floor(Math.random() * edgeTypes.length)] as 'transfer' | 'ownership' | 'interaction' | 'transaction',
      data: { timestamp: Date.now() - Math.floor(Math.random() * 1000000) }
    });
  }
  
  return { nodes, edges };
}

export default function Explorer() {
  interface Node {
    id: string;
    type: 'contract' | 'wallet' | 'token' | 'nft' | 'pda';
    label: string;
    data: { balance: number };
  }
  
  interface Edge {
    id: string;
    source: string;
    target: string;
    type: 'transfer' | 'ownership' | 'interaction' | 'transaction';
    data: { timestamp: number };
  }
  
  const [graphData, setGraphData] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filters, setFilters] = useState({
    nodeTypes: {
      contract: true,
      wallet: true,
      token: true,
      nft: true,
      pda: true
    },
    edgeTypes: {
      transfer: true,
      ownership: true,
      interaction: true,
      transaction: true
    }
  });
  
  // Load initial data
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const data = generateMockData(30);
    setGraphData(data);
  }, []);
  
  // Apply filters to the graph data
  const filteredData = {
    nodes: graphData.nodes.filter(node => filters.nodeTypes[node.type as keyof typeof filters.nodeTypes]),
    edges: graphData.edges.filter(edge => 
      filters.edgeTypes[edge.type as keyof typeof filters.edgeTypes] &&
      // Only include edges whose source and target nodes are both visible
      graphData.nodes.some(n => n.id === edge.source && filters.nodeTypes[n.type as keyof typeof filters.nodeTypes]) &&
      graphData.nodes.some(n => n.id === edge.target && filters.nodeTypes[n.type as keyof typeof filters.nodeTypes])
    )
  };
  
  // Handle node selection (for detailed view)
  const handleNodeSelect = (node: unknown) => {
    setSelectedNode(node);
  };
  
  // Toggle filter settings
  const toggleNodeTypeFilter = (type: keyof typeof filters.nodeTypes) => {
    setFilters({
      ...filters,
      nodeTypes: {
        ...filters.nodeTypes,
        [type]: !filters.nodeTypes[type]
      }
    });
  };
  
  const toggleEdgeTypeFilter = (type: keyof typeof filters.edgeTypes) => {
    setFilters({
      ...filters,
      edgeTypes: {
        ...filters.edgeTypes,
        [type]: !filters.edgeTypes[type]
      }
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockchain Relationship Explorer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar - Filters */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-1">Node Types</h3>
            {Object.keys(filters.nodeTypes).map(type => (
              <div key={type} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`node-${type}`}
                  checked={filters.nodeTypes[type as keyof typeof filters.nodeTypes]}
                  onChange={() => toggleNodeTypeFilter(type as keyof typeof filters.nodeTypes)}
                  className="mr-2"
                />
                <label htmlFor={`node-${type}`} className="capitalize">{type}</label>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Edge Types</h3>
            {Object.keys(filters.edgeTypes).map(type => (
              <div key={type} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`edge-${type}`}
                  checked={filters.edgeTypes[type as keyof typeof filters.edgeTypes]}
                  onChange={() => toggleEdgeTypeFilter(type as keyof typeof filters.edgeTypes)}
                  className="mr-2"
                />
                <label htmlFor={`edge-${type}`} className="capitalize">{type}</label>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-1">Search</h3>
            <input
              type="text"
              placeholder="Search by ID or label..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        {/* Main content - Graph visualization */}
        <div className="lg:col-span-3 bg-white border rounded-lg shadow-sm h-[600px]">
          <BlockchainGraph 
            data={filteredData} 
            width={800} 
            height={580} 
          />
        </div>
      </div>
      
      {/* Node details panel (shows when a node is selected) */}
      {selectedNode && (
        <div className="mt-4 bg-white p-4 border rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">{selectedNode.label}</h2>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <div className="mt-2">
            <p><span className="font-medium">Type:</span> {selectedNode?.type}</p>
            <p><span className="font-medium">ID:</span> {selectedNode?.id}</p>
            {selectedNode?.data && (
              <div className="mt-2">
                <h3 className="font-medium">Additional Data:</h3>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                  {JSON.stringify(selectedNode.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}