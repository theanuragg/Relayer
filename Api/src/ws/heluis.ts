import { WebSocketServer } from "ws";
import { dumpWalletData } from "../controller/account.controller";

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    console.log("✅ Client connected via WebSocket");

    ws.send(JSON.stringify({ message: "🟢 WebSocket connected" }));

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const wallet = data.wallet;

        if (!wallet) {
          ws.send(JSON.stringify({ error: "❌ Wallet address is required." }));
          return;
        }

        const result = await dumpWalletData(wallet);

        console.log("📦 Fetched Wallet Data:", result);

        ws.send(JSON.stringify({ status: "success", data: result }));
      } catch (err: any) {
        console.error("❌ Failed to process message:", err);
        ws.send(JSON.stringify({ error: "Something went wrong", details: err.message }));
      }
    });
  });

  console.log(`🚀 WebSocket server is running at ws://localhost:${port}`);
}
