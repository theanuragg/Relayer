
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
  
  constructor(
    private onConnected: () => void,
    private onDisconnected: () => void,
    private onMessage: (data: unknown) => void,
    private onError: (error: string) => void
  ) {}
  
  connect(): void {
    try {
      this.socket = new WebSocket(WS_URL);
      
      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.onConnected();
        this.socket?.send(JSON.stringify({
          wallet: MAIN_WALLET,
        }));
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket data:", data);
          this.onMessage(data);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          this.onError("Failed to parse WebSocket data");
        }
      };
      
      this.socket.onerror = (err) => {
        console.error("WebSocket error", err);
        this.onError("WebSocket error");
        this.onDisconnected();
      };
      
      this.socket.onclose = () => {
        console.log("WebSocket closed");
        this.onDisconnected();
      };
      
      // Store socket instance in window for cleanup
      window.transactionSocket = this.socket;
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      this.onError("Error connecting to WebSocket server");
      this.onDisconnected();
    }
  }
  
  disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.onDisconnected();
    }
  }
}