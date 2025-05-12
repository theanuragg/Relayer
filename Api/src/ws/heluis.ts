import express from 'express';
import { WebSocketServer } from 'ws';
import { dumpWalletData } from "../controller/account.controller";
import http from 'http';

export function createWebSocketServer() {
  const app = express();

  // Optional: HTTP health route
  app.get('/', (req, res) => {
    res.send('🟢 WebSocket Server Running');
  });

  // Use Railway-provided port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

  // Correct: use plain HTTP server (Railway handles HTTPS)
  const server = http.createServer(app);

  // WebSocket server attached to the HTTP server
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
    console.log(`🚀 WebSocket server is running at ws://localhost:${port}`);
  });
}
