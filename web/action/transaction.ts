
// websocketService.ts
import { MAIN_WALLET, WS_URL } from '../lib/transactionutils';

// Extend the Window interface to include transactionSocket
declare global {
  interface Window {
    transactionSocket?: WebSocket;
  }
}

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
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.onConnected();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessage(data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.onDisconnected();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.onError(error);
    };
  }

  disconnect() {
    this.socket?.close();
  }

  sendWalletAddress(address: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ wallet: address }));
    } else {
      console.warn("WebSocket not connected");
    }
  }
}
