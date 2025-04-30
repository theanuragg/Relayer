'use client';


// components/BlockchainGraph.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  type: 'contract' | 'wallet' | 'token' | 'nft' | 'pda';
  label: string;
  data?: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'transfer' | 'ownership' | 'interaction' | 'transaction';
  data?: any;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface BlockchainGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
}

const NODE_COLORS = {
  contract: '#ff7f0e', // orange
  wallet: '#1f77b4',   // blue
  token: '#2ca02c',    // green
  nft: '#9467bd',      // purple
  pda: '#e377c2',      // pink
};

const EDGE_COLORS = {
  transfer: '#aaa',
  ownership: '#666',
  interaction: '#999',
  transaction: '#333',
};

const BlockchainGraph: React.FC<BlockchainGraphProps> = ({ 
  data, 
  width = 800, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;
    
    // Clear previous rendering
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    // Add zoom functionality
    const g = svg.append("g");
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );
    
    // Convert edge data to D3 format (source and target as objects)
    const links = data.edges.map(edge => ({
      ...edge,
      source: data.nodes.find(n => n.id === edge.source) || edge.source,
      target: data.nodes.find(n => n.id === edge.target) || edge.target
    }));
    
    // Create a force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(links).id(d => (d as Node).id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));
    
    // Create arrow marker definitions
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Draw the links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", d => EDGE_COLORS[(d as Edge).type] || "#999")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");
    
    // Create node groups
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(
        d3.drag<SVGGElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
    
    // Draw node circles
    node.append("circle")
      .attr("r", 15)
      .attr("fill", d => NODE_COLORS[d.type] || "#ccc")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
    
    // Add node labels
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .text(d => d.label.substring(0, 2))
      .attr("font-size", "10px")
      .attr("fill", "white");
    
    // Add tooltips for nodes
    node.append("title")
      .text(d => `${d.label} (${d.type})`);
    
    // Update positions in the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x || 0)
        .attr("y1", d => (d.source as Node).y || 0)
        .attr("x2", d => (d.target as Node).x || 0)
        .attr("y2", d => (d.target as Node).y || 0);
      
      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });
    
    // Drag handlers
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);
  
  return (
    <div className="blockchain-graph">
      <svg ref={svgRef} />
    </div>
  );
};

export default BlockchainGraph;