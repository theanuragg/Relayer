import https from 'https';
import express from 'express';
import { WebSocketServer } from 'ws';
import { dumpWalletData } from "../controller/account.controller";

export function createWebSocketServer() {
  const app = express();

  // Optional: Add HTTP route for health check or API
  app.get('/', (req, res) => {
    res.send('🟢 WebSocket Server Running');
  });

  // Use Railway-assigned PORT
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

  // Railway handles TLS, so you can use plain createServer (Railway will auto TLS terminate)
  const server = https.createServer({}, app);

  // Attach WebSocket server to HTTPS server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('✅ Client connected via WebSocket');

    ws.send(JSON.stringify({ message: '🟢 WebSocket connected' }));

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const wallet = data.wallet;

        if (!wallet) {
          ws.send(JSON.stringify({ error: '❌ Wallet address is required.' }));
          return;
        }

        const result = await dumpWalletData(wallet);
        console.log('📦 Fetched Wallet Data:', result);
        ws.send(JSON.stringify({ status: 'success', data: result }));
      } catch (err: any) {
        console.error('❌ Failed to process message:', err);
        ws.send(JSON.stringify({ error: 'Something went wrong', details: err.message }));
      }
    });
  });

  server.listen(port, () => {
    console.log(`🚀 WebSocket server is running at wss://your-railway-app-domain:${port}`);
  });
}
