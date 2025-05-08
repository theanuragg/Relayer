"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Dummy type declarations (replace with your actual types if different)
type Node = {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type Edge = {
  source: string;
  target: string;
  type: string;
};

interface BlockchainGraphProps {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
  width?: number;
  height?: number;
}

// Example color maps (customize as needed)
const NODE_COLORS: Record<string, string> = {
  account: "#4CAF50",
  contract: "#2196F3",
  default: "#ccc",
};

const EDGE_COLORS: Record<string, string> = {
  transfer: "#FF9800",
  call: "#9C27B0",
  default: "#999",
};

const BlockchainGraph: React.FC<BlockchainGraphProps> = ({
  data,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // Clear old drawings

    const g = svg.append("g");

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );

    const links = data.edges.map((edge) => ({
      ...edge,
      source: data.nodes.find((n) => n.id === edge.source) || edge.source,
      target: data.nodes.find((n) => n.id === edge.target) || edge.target,
    }));

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Arrows
    svg
      .append("defs")
      .selectAll("marker")
      .data(["arrow"])
      .enter()
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Draw links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_COLORS[d.type] || EDGE_COLORS.default)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append("circle")
      .attr("r", 20) // corrected radius from 300 to 20
      .attr("fill", (d) => NODE_COLORS[d.type] || NODE_COLORS.default)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .text((d) => d.label.substring(0, 2))
      .attr("font-size", "10px")
      .attr("fill", "white");

    node.append("title").text((d) => `${d.label} (${d.type})`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x || 0)
        .attr("y1", (d) => (d.source as Node).y || 0)
        .attr("x2", (d) => (d.target as Node).x || 0)
        .attr("y2", (d) => (d.target as Node).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

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
