'use client'

import { useEffect, useState } from "react";
import GraphVisualization from "../../components/explore/graphvisualization";
import   TransactionInfo  from "../../components/explore/infopanel";
import Legend from "../../components/explore/legend";
import RawDataViewer from "../../components/explore/rawdataviewer";
import useTransactionStore from "../../store/transactionstore";
import InfoPanel from "../../components/explore/infopanel";

export default function TransactionGraph() {
  // Get state and actions from the store
  const {
    graphData,
    selectedElement,
    selectedType,
    rawMessage,
    error,
    connected,
    isLoading,
    initializeData,
    connectWebSocket,
    disconnectWebSocket
  } = useTransactionStore();

  const [lastWebSocketMessage, setLastWebSocketMessage] = useState<string | null>(null);

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
      <h2 className="text-xl font-bold mb-4">Solana Transaction Network</h2>
      
      {/* Connection status */}
      <div className="mb-4 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>{connected ? 'Connected to WebSocket' : 'Disconnected'}</span>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => useTransactionStore.getState().clearError()}
            className="text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* <div className="border rounded-lg shadow-lg bg-white p-4 h-96 md:h-[600px] w-full relative"> */}
            {/* Debug display for graph data
            {graphData && graphData.nodes && graphData.nodes.length === 0 && (
              <div className="bg-yellow-100 p-2 mb-2 rounded">
                No nodes to display. Check WebSocket connection.
              </div>
            )} */}
            
            {/* Graph visualization */}
            {/* <GraphVisualization /> */}
            
            {/* Info panel for selected elements */}
            <div>
            {selectedElement && (
              <InfoPanel/>


            )}
          </div>
                 
          <div className="w-full md:w-1/3">
            {/* <Legend /> */}
            <TransactionInfo/>
            {/* Raw data display */}
            <div className="border rounded-lg shadow-lg bg-white p-4 mt-4 max-h-80 overflow-auto">
              <h3 className="font-semibold mb-2">Raw WebSocket Data</h3>
              {lastWebSocketMessage ? (
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {lastWebSocketMessage}
                </pre>
              ) : (
                <p className="text-gray-500">No WebSocket data received yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}