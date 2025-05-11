// WebSocketService.ts
import { MAIN_WALLET, WS_URL } from '../lib/transactionutils';

// Extend the Window interface to include transactionSocket
declare global {
  interface Window {
    transactionSocket?: WebSocket;
  }
}

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER|| "ws://localhost:8080";

export class WebSocketService {
  private socket: WebSocket | null = null;
  private onConnected: () => void;
  private onDisconnected: () => void;
  private onMessage: (data: any) => void;
  private onError: (error: any) => void;

  constructor(
    onConnected: () => void,
    onDisconnected: () => void,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) {
    this.onConnected = onConnected;
    this.onDisconnected = onDisconnected;
    this.onMessage = onMessage;
    this.onError = onError;
    
    console.log("WebSocketService initialized");
  }

  connect() {
    console.log(`Connecting to WebSocket at ${NEXT_PUBLIC_URL}`);
    
    try {
      this.socket = new WebSocket(NEXT_PUBLIC_URL);
      
      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        this.onConnected();
      };
      
      this.socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data.substring(0, 200) + (event.data.length > 200 ? '...' : ''));
        
        try {
          const data = JSON.parse(event.data);
          console.log("Parsed WebSocket data structure:", Object.keys(data));
          this.onMessage(data);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          this.onError("Failed to parse WebSocket message: " + err);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket disconnected with code ${event.code}, reason: ${event.reason}`);
        this.onDisconnected();
      };
      
      this.socket.onerror = (error) => {
        console.error("WebSocket connection error:", error);
        this.onError(error);
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      this.onError(err);
    }
  }

  disconnect() {
    console.log("Initiating WebSocket disconnect");
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendWalletAddress(address: string) {
    console.log(`Preparing to send wallet address: ${address}`);
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ wallet: address });
      console.log(`Sending message to socket: ${message}`);
      this.socket.send(message);
    } else {
      const state = this.socket ? 
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.socket.readyState] : 
        'NULL';
      console.warn(`WebSocket not ready (state: ${state}). Cannot send wallet address.`);
    }
  }
}