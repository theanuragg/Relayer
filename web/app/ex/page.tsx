"use client";

import { useEffect, } from "react";
import GraphVisualization from "../../components/explore/graphvisualization";
// import InfoPanel from "../../components/explore/infopanel";
// import Legend from "../../components/explore/legend";
import RawDataViewer from "../../components/explore/rawdataviewer";
import useTransactionStore from "../../store/transactionstore";

export default function TransactionGraph() {
  // Get state and actions from the store
  const {
    graphData,
    
    rawMessage,
 
    initializeData,
    connectWebSocket,
    disconnectWebSocket,
  } = useTransactionStore();

  // Initialize data and connect WebSocket on component mount
  useEffect(() => {
    console.log("Initializing data and connecting WebSocket");
    initializeData();
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, [initializeData, connectWebSocket, disconnectWebSocket]);

  // Update the last WebSocket message whenever rawMessage changes
  useEffect(() => {
    if (rawMessage) {
      setLastWebSocketMessage(JSON.stringify(rawMessage, null, 2));
    }
  }, [rawMessage]);

  // Debug log to check if graph data is available
  useEffect(() => {
    console.log("Graph data in component:", graphData);
  }, [graphData]);

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-bold mb-4 custom-heading3">Solana Transaction Network</h2>
      <div className="flex p-4 flex-row gap-4 mb-4">
        <RawDataViewer />
        
        <div className="flex flex-col gap-4 w-2xl h-full">
          <GraphVisualization />
          <div className="flex flex-col w-full">
            {/* <InfoPanel /> */}
            {/* <Legend /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
function setLastWebSocketMessage(message: string) {
  console.log("Last WebSocket Message:", message);
}

