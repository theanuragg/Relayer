import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {D3DragEvent } from 'd3';
import ZoomControls from "./zoomcontrols";
import useTransactionStore from "../../store/transactionstore";

// Define Types for Graph Elements
type Node = {
  fy: number | undefined;
  fx: number | undefined;
  id: string;
  label: string;
  isMainWallet: boolean;
  x?: number;
  y?: number;
};

type Link = {
  source: string | Node;
  target: string | Node;
  amount: number;
};

type GraphData = {
  nodes: Node[];
  links: Link[];
};

export default function GraphVisualization() {
  // Get state and actions from the store
  const {
      graphData: rawGraphData,
      selectedElement,
      selectedType,
      setSelectedElement,
      clearSelection
    } = useTransactionStore();
  
  const graphData = rawGraphData as GraphData;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  useEffect(() => {
    if (graphData.nodes.length === 0) return;

    const width = 800;
    const height = 600;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG and initialize zoom
    const { g } = initializeSvgAndZoom(width, height);

    // Add arrow marker for directed edges
    const svgElement = svgRef.current;
    if (svgElement) {
      addArrowMarker(d3.select(svgElement));
    }

    // Create links, labels and nodes
    const { link, linkLabel, node } = createGraphElements(g, graphData);

    // Create force simulation
    const simulation = createForceSimulation(graphData, width, height, link, linkLabel, node);

    // Store simulation reference
    simulationRef.current = simulation;

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, selectedElement, selectedType, createForceSimulation]);

  // Initialize SVG and zoom functionality
  function initializeSvgAndZoom(width: number, height: number) {
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Create zoom behavior
    const zoom: d3.ZoomBehavior<Element, unknown> = d3.zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Apply zoom to SVG
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    svg.call(zoom);

    // Add container for graph elements
    const g = svg.append("g");

    // Clear selection when clicking on the background
    svg.on("click", () => {
      clearSelection();
    });

    // Add zoom controls as a component
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ZoomControls(svg, zoom);

    return { svg, g };
  }

  // Add arrow marker for directed edges
  function addArrowMarker(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");
  }

  // Create all graph elements (links, labels, nodes)
  function createGraphElements(g: d3.Selection<SVGGElement, unknown, null, undefined>, graphData: GraphData) {
    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke", d => d === selectedElement && selectedType === 'link' ? "orange" : "#999")
      .attr("stroke-width", d => Math.sqrt(d.amount))
      .attr("marker-end", "url(#arrowhead)")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedElement(d, 'link');
      });

    // Create link labels
    const linkLabel = g.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(graphData.links)
      .enter().append("text")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .text(d => `${d.amount.toFixed(2)} SOL`);

    // Create nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .enter().append("g")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedElement(d, 'node');
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.isMainWallet ? 12 : 8)
      .attr("fill", d => {
        if (d === selectedElement && selectedType === 'node') return "orange";
        return d.isMainWallet ? "#ff6384" : "#36a2eb";
      });

    // Add labels to nodes
    node.append("text")
      .attr("dx", 0)
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", d => d.isMainWallet ? 12 : 10)
      .text(d => d.label);

    return { link, linkLabel, node };
  }

  // Create force simulation
  function createForceSimulation(graphData: GraphData, width: number, height: number, link: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>, linkLabel: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>, node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>) {
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => (d as Node).id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50))
      .on("tick", () => ticked(link, linkLabel, node));

    return simulation;
  }

  function ticked(
    link: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>,
    linkLabel: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>,
    node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>
  ) {
    link
      .attr("x1", (d: Link) => (d.source as Node).x ?? 0)
      .attr("y1", (d: Link) => (d.source as Node).y ?? 0)
      .attr("x2", (d: Link) => (d.target as Node).x ?? 0)
      .attr("y2", (d: Link) => (d.target as Node).y ?? 0);
  
    linkLabel
      .attr("x", (d: Link) => {
        const sourceX = (d.source as Node)?.x ?? 0;
        const targetX = (d.target as Node)?.x ?? 0;
        return (sourceX + targetX) / 2;
      })
      .attr("y", (d: Link) => {
        const sourceY = (d.source as Node)?.y ?? 0;
        const targetY = (d.target as Node)?.y ?? 0;
        return (sourceY + targetY) / 2;
      });
  
    node.attr("transform", (d: Node) => `translate(${d.x ?? 0},${d.y ?? 0})`);
  }
  


  // Drag functions
  function dragstarted(event: D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
    if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event: D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event: D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
    if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
    // Keep the node fixed at its new position
    d.fx = undefined;
    d.fy = undefined;
  }
  return (
    <div className="h-full w-full relative overflow-hidden">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ cursor: "pointer" }}
      ></svg>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 px-2 py-1 rounded-md text-sm">
        Tip: Drag nodes to reposition them
      </div>
    </div>
  );
}
