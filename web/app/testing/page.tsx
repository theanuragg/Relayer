'use client'

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

export default function TransactionGraph() {
  const [rawMessage, setRawMessage] = useState(null);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'node' or 'link'
  
  // References for D3
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  
  // Initialize the graph
  useEffect(() => {
    if (graphData.nodes.length === 0) return;
    
    const width = 800;
    const height = 600;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");
      
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
      
    // Apply zoom to SVG
    svg.call(zoom);
    
    // Add zoom controls
    const zoomControls = svg.append("g")
      .attr("class", "zoom-controls")
      .attr("transform", "translate(20, 20)");
      
    // Zoom in button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 15)
      .attr("r", 15)
      .attr("fill", "white")
      .attr("stroke", "#ccc");
      
    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .text("+")
      .style("pointer-events", "none");
      
    // Zoom out button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 55)
      .attr("r", 15)
      .attr("fill", "white")
      .attr("stroke", "#ccc");
      
    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .text("-")
      .style("pointer-events", "none");
      
    // Reset button
    zoomControls.append("circle")
      .attr("cx", 15)
      .attr("cy", 95)
      .attr("r", 15)
      .attr("fill", "white")
      .attr("stroke", "#ccc");
      
    zoomControls.append("text")
      .attr("x", 15)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("↺")
      .style("pointer-events", "none");
      
    // Add click handlers for zoom controls
    zoomControls.select("circle:nth-child(1)")
      .on("click", () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
      });
      
    zoomControls.select("circle:nth-child(3)")
      .on("click", () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
      });
      
    zoomControls.select("circle:nth-child(5)")
      .on("click", () => {
        svg.transition().duration(300).call(
          zoom.transform,
          d3.zoomIdentity.translate(0, 0).scale(1)
        );
      });
    
    // Add container for graph elements
    const g = svg.append("g");
    
    // Add arrow marker for directed edges
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
        setSelectedElement(d);
        setSelectedType('link');
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
        setSelectedElement(d);
        setSelectedType('node');
      })
      .call(d3.drag()
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
      
    // Clear selection when clicking on the background
    svg.on("click", () => {
      setSelectedElement(null);
      setSelectedType(null);
    });
      
    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50))
      .on("tick", ticked);
      
    // Store simulation reference
    simulationRef.current = simulation;
    
    // Update positions on each tick
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 10);
        
      node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    }
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep the node fixed at its new position
      // Comment these out to let nodes return to simulation
      // d.fx = null;
      // d.fy = null;
    }
    
    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, selectedElement, selectedType]);
  
  // WebSocket connection to get transaction data
  useEffect(() => {
    // Sample data for initial rendering
    const sampleTransactions = [
      {
        "description": "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS transferred 2.89258 SOL to 6UoCsHVFQ4oBv9yRxnjpbBTedJiWdneX4MEuvZwMKh66.",
        "signature": "23nwtMzka6TeL4zCsXww6nJSpB9sw5eQiecJ9E6VWVgtt9vCnQVtcphAaURMgSHfNBrvaYMcr9Y9BC49ytjss7rg",
        "nativeTransfers": [
          {
            "fromUserAccount": "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
            "toUserAccount": "6UoCsHVFQ4oBv9yRxnjpbBTedJiWdneX4MEuvZwMKh66",
            "amount": 2892580000
          }
        ]
      },
      {
        "description": "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS transferred 0.1 SOL to 6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d.",
        "signature": "3EJsc2WoRVyy3kS86QfC8soQqcVZrSySFjFZFp262QiR375ZEQiRismxi2fpvqMxYB1tHuPLFr7fkhDYnGt9uPdE",
        "nativeTransfers": [
          {
            "fromUserAccount": "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
            "toUserAccount": "6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d",
            "amount": 100000000
          }
        ]
      }
    ];
    
    // Process the sample data immediately
    processTransactions(sampleTransactions);
    
    // Set up WebSocket connection
    let socket;
    try {
      socket = new WebSocket("ws://localhost:8080");
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        socket.send(JSON.stringify({
          wallet: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
        }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);
          setRawMessage(data);
          
          if (data.data && data.data.transactions) {
            processTransactions(data.data.transactions);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };
      
      socket.onerror = (err) => {
        console.error("WebSocket error", err);
        setError("WebSocket error");
      };
      
      socket.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      setError("Error connecting to WebSocket server");
    }
    
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);
  
  // Process transactions into graph data
  const processTransactions = (transactions) => {
    // Track unique nodes (wallets)
    const uniqueNodes = new Map();
    const newLinks = [];
    
    // Process each transaction
    transactions.forEach(tx => {
      if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
        tx.nativeTransfers.forEach(transfer => {
          const fromAddress = transfer.fromUserAccount;
          const toAddress = transfer.toUserAccount;
          const amount = transfer.amount / 1000000000; // Convert lamports to SOL
          
          // Add source node if it doesn't exist
          if (!uniqueNodes.has(fromAddress)) {
            uniqueNodes.set(fromAddress, {
              id: fromAddress,
              label: `${fromAddress.substring(0, 4)}...${fromAddress.substring(fromAddress.length - 4)}`,
              fullAddress: fromAddress,
              isMainWallet: fromAddress === "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS"
            });
          }
          
          // Add target node if it doesn't exist
          if (!uniqueNodes.has(toAddress)) {
            uniqueNodes.set(toAddress, {
              id: toAddress,
              label: `${toAddress.substring(0, 4)}...${toAddress.substring(toAddress.length - 4)}`,
              fullAddress: toAddress,
              isMainWallet: toAddress === "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS"
            });
          }
          
          // Create link
          newLinks.push({
            id: tx.signature.substring(0, 8),
            source: fromAddress,
            target: toAddress,
            amount: amount,
            signature: tx.signature,
            description: tx.description
          });
        });
      }
    });
    
    // Convert Map to array
    const newNodes = Array.from(uniqueNodes.values());
    
    // Update graph data
    setGraphData({
      nodes: newNodes,
      links: newLinks
    });
  };
  
  // Reset selected element
  const handleCloseInfo = () => {
    setSelectedElement(null);
    setSelectedType(null);
  };
  
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-bold mb-4">Solana Transaction Network</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="border rounded-lg shadow-lg bg-white p-4 h-96 md:h-[600px] w-full relative">
          {/* Graph visualization */}
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
          
          {/* Info panel for selected elements */}
          {selectedElement && (
            <div className="absolute top-2 right-2 bg-white border shadow-md p-4 rounded max-w-xs">
              {selectedType === 'node' && (
                <>
                  <h3 className="font-bold text-lg mb-2">Wallet Address</h3>
                  <p className="break-all mb-2">{selectedElement.fullAddress}</p>
                  {selectedElement.isMainWallet && (
                    <p className="text-sm bg-red-100 p-1 rounded">Main Wallet</p>
                  )}
                </>
              )}
              
              {selectedType === 'link' && (
                <>
                  <h3 className="font-bold text-lg mb-2">Transaction</h3>
                  <p className="mb-2">
                    <span className="font-semibold">Amount:</span> {selectedElement.amount.toFixed(4)} SOL
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">From:</span>{" "}
                    <span className="break-all">
                      {selectedElement.source.id || selectedElement.source}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">To:</span>{" "}
                    <span className="break-all">
                      {selectedElement.target.id || selectedElement.target}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Signature:</span>{" "}
                    <span className="break-all text-xs">
                      {selectedElement.signature}
                    </span>
                  </p>
                </>
              )}
              
              <button 
                onClick={handleCloseInfo}
                className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="border rounded-lg shadow-lg bg-white p-4">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
              <span>Main wallet (5jeA...XADS)</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
              <span>Other wallets</span>
            </div>
            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-gray-600 mr-2"></div>
              <span>Transaction (with SOL amount)</span>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Interactions</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Click and drag nodes to reposition them</li>
                <li>Click on nodes to see wallet details</li>
                <li>Click on connections to see transaction details</li>
                <li>Scroll or use buttons to zoom in/out</li>
                <li>Click and drag the background to pan</li>
                <li>The width of connections indicates the transaction amount</li>
              </ul>
            </div>
          </div>
          
          {rawMessage && (
            <div className="border rounded-lg shadow-lg bg-white p-4 mt-4 max-h-80 overflow-auto">
              <h3 className="font-semibold mb-2">Raw Data (Latest Transaction)</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(rawMessage.data?.transactions?.[0] || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}