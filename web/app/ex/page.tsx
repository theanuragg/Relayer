"use client";

import { useEffect } from "react";
import GraphVisualization from "../../components/explore/graphvisualization";
import Legend from "../../components/explore/legend";
import RawDataViewer from "../../components/explore/rawdataviewer";
import useTransactionStore from "../../store/transactionstore";
import AppBar from "@/components/explore/appbar";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import useIsMobile from "@/hooks/useIsMobile"; // Import the hook

export default function TransactionGraph() {
  const {
    graphData,
    rawMessage,
    initializeData,
    connectWebSocket,
    disconnectWebSocket,
  } = useTransactionStore();

  const isMobile = useIsMobile(); // Call hook

  useEffect(() => {
    initializeData();
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [initializeData, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    if (rawMessage) {
      setLastWebSocketMessage(JSON.stringify(rawMessage, null, 2));
    }
  }, [rawMessage]);

  useEffect(() => {
    console.log("Graph data in component:", graphData);
  }, [graphData]);

  return (
    <div className="flex flex-col w-full h-screen">
      <AppBar />
      <div className="flex-grow mt-24 px-4">
        {isMobile ? (
          // Mobile: Stack vertically
          <div className="flex flex-col gap-4">
            <RawDataViewer />
            <GraphVisualization />
            <Legend />
          </div>
        ) : (
          // Desktop: Use resizable panels
          <PanelGroup direction="horizontal">
            <Panel defaultSize={75} minSize={20}>
              <RawDataViewer />
            </Panel>

            <PanelResizeHandle className="w-2 cursor-col-resize" />

            <Panel defaultSize={25} minSize={20}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={60} minSize={20}>
                  <GraphVisualization />
                </Panel>

                <PanelResizeHandle className="h-2 cursor-row-resize" />

                <Panel defaultSize={40} minSize={10}>
                  <Legend />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}

function setLastWebSocketMessage(message: string) {
  console.log("Last WebSocket Message:", message);
}
