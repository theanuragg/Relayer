"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { D3DragEvent } from "d3";
import ZoomControls from "./zoomcontrols";
import useTransactionStore from "../../store/transactionstore"; 
import { Node, Link, GraphData } from "../../types/transactiontypes"; 

export default function GraphVisualization() {
  // Get state and actions from the refactored store
  const {
    graphData: rawGraphData,
    selectedElement,
    selectedType,
    setSelectedElement,
    clearSelection,
  } = useTransactionStore();

  const graphData = rawGraphData as GraphData;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  // Initialize SVG and zoom functionality
  const initializeSvgAndZoom = useCallback(
    (width: number, height: number) => {
      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", [0, 0, width, height])
        .attr("width", "100%")
        .attr("height", "100%")
        .style("background-color", "#121212"); 

      // Create zoom behavior
      const zoom: d3.ZoomBehavior<SVGSVGElement, unknown> = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 5])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      // Apply zoom to SVG
      if (svgRef.current) {
        const svgSelection = d3.select(svgRef.current);
        svgSelection.call(zoom);
      }

      // Add container for graph elements
      const g = svg.append("g");

      // Clear selection when clicking on the background
      svg.on("click", () => {
        clearSelection();
      });

      // Add zoom controls as a component
      if (svgRef.current) {
        ZoomControls(
          d3.select(svgRef.current) as d3.Selection<
            SVGSVGElement,
            unknown,
            null,
            undefined
          >,
          zoom
        );
      }

      return { svg, g };
    },
    [clearSelection]
  );

  // Add glow filter definitions
  const addFilters = useCallback(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const defs = svg.append("defs");

      // Arrow marker
      defs
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#66ccff");

      // Red glow filter for main wallet nodes
      const redGlow = defs
        .append("filter")
        .attr("id", "red-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      redGlow
        .append("feGaussianBlur")
        .attr("stdDeviation", "5")
        .attr("result", "blur");

      redGlow
        .append("feFlood")
        .attr("flood-color", "#ff3366")
        .attr("flood-opacity", "4.0")
        .attr("result", "color");

      redGlow
        .append("feComposite")
        .attr("in", "color")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "glow");

      redGlow
        .append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "glow")
        .attr("operator", "over");


      // Blue glow filter for regular nodes
      const blueGlow = defs
        .append("filter")
        .attr("id", "blue-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      blueGlow
        .append("feGaussianBlur")
        .attr("stdDeviation", "5.5")
        .attr("result", "blur");

      blueGlow
        .append("feFlood")
        .attr("flood-color", "#00aaff")
        .attr("flood-opacity", "2.0")
        .attr("result", "color");

      blueGlow
        .append("feComposite")
        .attr("in", "color")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "glow");

      blueGlow
        .append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "glow")
        .attr("operator", "over");

      // Orange glow filter for selected elements
      const orangeGlow = defs
        .append("filter")
        .attr("id", "orange-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      orangeGlow
        .append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "blur");

      orangeGlow
        .append("feFlood")
        .attr("flood-color", "#ff9900")
        .attr("flood-opacity", "2.0")
        .attr("result", "color");

      orangeGlow
        .append("feComposite")
        .attr("in", "color")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "glow");

      orangeGlow
        .append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "glow")
        .attr("operator", "over");

      // Edge glow filter
      const edgeGlow = defs
        .append("filter")
        .attr("id", "edge-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      edgeGlow
        .append("feGaussianBlur")
        .attr("stdDeviation", "1.5")
        .attr("result", "blur");

      edgeGlow
        .append("feFlood")
        .attr("flood-color", "#66ccff")
        .attr("flood-opacity", "0.5")
        .attr("result", "color");

      edgeGlow
        .append("feComposite")
        .attr("in", "color")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "glow");

      edgeGlow
        .append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "glow")
        .attr("operator", "over");
    },
    []
  );

  // Create all graph elements (links, labels, nodes)
  const createGraphElements = useCallback(
    (
      g: d3.Selection<SVGGElement, unknown, null, undefined>,
      graphData: GraphData
    ) => {
      // Create links with glow effect
      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .attr("stroke", (d) =>
          d === selectedElement && selectedType === "link"
            ? "#ffaa00"
            : "#66ccff"
        )
        .attr("stroke-width", (d) => Math.sqrt(d.amount) * 1.2)
        .attr("marker-end", "url(#arrowhead)")
        .attr("filter", (d) =>
          d === selectedElement && selectedType === "link"
            ? "url(#orange-glow)"
            : "url(#edge-glow)"
        )
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedElement(d, "link");
        });

      // Create link labels with white text
      const linkLabel = g
        .append("g")
        .attr("class", "link-labels")
        .selectAll("text")
        .data(graphData.links)
        .enter()
        .append("text")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("stroke", "none")
        .text((d) => `${d.amount.toFixed(2)} SOL`);

      // Create nodes with glow effects
      const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graphData.nodes)
        .enter()
        .append("g")
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedElement(d, "node");
        })
        .call(
          d3
            .drag<SVGGElement, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      // Add circles to nodes with glow effect
      node
        .append("circle")
        .attr("r", (d) => (d.isMainWallet ? 12 : 8))
        .attr("fill", (d) => {
          if (d === selectedElement && selectedType === "node")
            return "#ffaa00";
          return d.isMainWallet ? "#ff3366" : "#00aaff";
        })
        .attr("filter", (d) => {
          if (d === selectedElement && selectedType === "node")
            return "url(#orange-glow)";
          return d.isMainWallet ? "url(#red-glow)" : "url(#blue-glow)";
        });

      // Add labels to nodes with white text
      node
        .append("text")
        .attr("dx", 0)
        .attr("dy", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", (d) => (d.isMainWallet ? 12 : 10))
        .attr("fill", "white")
        .attr("stroke", "none")
        .text((d) => d.label);

      return { link, linkLabel, node };
    },
    [selectedElement, selectedType, setSelectedElement]
  );

  const ticked = useCallback(
    (
      link: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>,
      linkLabel: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>,
      node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>
    ) => {
      link
        .attr("x1", (d) => (isNode(d.source) ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (isNode(d.source) ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (isNode(d.target) ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (isNode(d.target) ? d.target.y ?? 0 : 0));

      linkLabel
        .attr("x", (d) => {
          const sourceX = isNode(d.source) ? d.source.x ?? 0 : 0;
          const targetX = isNode(d.target) ? d.target.x ?? 0 : 0;
          return (sourceX + targetX) / 2;
        })
        .attr("y", (d) => {
          const sourceY = isNode(d.source) ? d.source.y ?? 0 : 0;
          const targetY = isNode(d.target) ? d.target.y ?? 0 : 0;
          return (sourceY + targetY) / 2;
        });

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    },
    []
  );

  // Create force simulation
  const createForceSimulation = useCallback(
    (
      graphData: GraphData,
      width: number,
      height: number,
      link: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>,
      linkLabel: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>,
      node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>
    ) => {
      const simulation = d3
        .forceSimulation(graphData.nodes)
        .force(
          "link",
          d3
            .forceLink(graphData.links)
            .id((d) => (d as Node).id)
            .distance(150)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(50))
        .on("tick", () => ticked(link, linkLabel, node));

      return simulation;
    },
    [ticked]
  );

  // Ticking function for simulation
  // Helper function to check if an object is a Node
  function isNode(obj: unknown): obj is Node {
    return typeof obj === "object" && obj !== null && "x" in obj && "y" in obj;
  }

  // const ticked = useCallback(
  //   (
  //     link: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>,
  //     linkLabel: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>,
  //     node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>
  //   ) => {
  //     link
  //       .attr("x1", (d) => (isNode(d.source) ? d.source.x ?? 0 : 0))
  //       .attr("y1", (d) => (isNode(d.source) ? d.source.y ?? 0 : 0))
  //       .attr("x2", (d) => (isNode(d.target) ? d.target.x ?? 0 : 0))
  //       .attr("y2", (d) => (isNode(d.target) ? d.target.y ?? 0 : 0));

  //     linkLabel
  //       .attr("x", (d) => {
  //         const sourceX = isNode(d.source) ? d.source.x ?? 0 : 0;
  //         const targetX = isNode(d.target) ? d.target.x ?? 0 : 0;
  //         return (sourceX + targetX) / 2;
  //       })
  //       .attr("y", (d) => {
  //         const sourceY = isNode(d.source) ? d.source.y ?? 0 : 0;
  //         const targetY = isNode(d.target) ? d.target.y ?? 0 : 0;
  //         return (sourceY + targetY) / 2;
  //       });

  //     node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
  //   },
  //   []
  // );

  // Drag functions
  function dragstarted(
    event: D3DragEvent<SVGGElement, Node, unknown>,
    d: Node
  ) {
    if (!event.active && simulationRef.current)
      simulationRef.current.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
    if (!event.active && simulationRef.current)
      simulationRef.current.alphaTarget(0);
    d.fx = undefined;
    d.fy = undefined;
  }

  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) return;

    const width = 800;
    const height = 600;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG and initialize zoom
    const { g } = initializeSvgAndZoom(width, height);

    // Add filters for glowing effects
    const svgElement = svgRef.current;
    if (svgElement) {
      addFilters(d3.select(svgElement));
    }

    // Create links, labels and nodes
    const { link, linkLabel, node } = createGraphElements(g, graphData);

    // Cast link and linkLabel to the expected type
    const typedLink = link as d3.Selection<
      SVGLineElement,
      Link,
      SVGGElement,
      unknown
    >;
    const typedLinkLabel = linkLabel as d3.Selection<
      SVGTextElement,
      Link,
      SVGGElement,
      unknown
    >;

    // Create force simulation
    const simulation = createForceSimulation(
      graphData,
      width,
      height,
      typedLink,
      typedLinkLabel,
      node
    );

    // Store simulation reference
    simulationRef.current = simulation;

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    graphData,
    initializeSvgAndZoom,
    addFilters,
    createGraphElements,
    createForceSimulation,
  ]);

  return (
    <div className="h-full w-full relative overflow-hidden border rounded-lg">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: "pointer" }}
      ></svg>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/20 px-2 py-1 rounded-md text-sm text-white">
        Tip: Drag nodes to reposition them
      </div>
    </div>
  );
}
