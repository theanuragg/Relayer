"use client";

import { useEffect, useState } from "react";

export default function TransactionList() {
  interface WebSocketMessage {
    // Define the expected structure of the WebSocket message
    [key: string]: unknown; // Replace with specific fields if known
  }

  const [rawMessage, setRawMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connected");

      // If the server expects a message with the wallet:
      socket.send(JSON.stringify({
        wallet: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);
        setRawMessage(data);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onerror = (err: unknown) => {
      console.error("WebSocket error", err);
      setError("WebSocket error");
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">WebSocket Data</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {rawMessage ? JSON.stringify(rawMessage, null, 2) : "Waiting for data..."}
      </pre>
    </div>
  );
}
