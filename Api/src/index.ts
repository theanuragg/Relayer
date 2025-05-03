// helius-ws.js
import NodeWebSocket from 'ws';
import axios from 'axios';
import      dotenv from 'dotenv';
dotenv.config();

const BASE_URL = `https://api-devnet.helius.xyz/v0/addresses/${process.env.WALLET}`;
console.log(process.env.WALLET);

const WS_URL = `wss://mainnet.helius-rpc.com/?api-key=${process.env.API_KEY}`;

const headers = {
    "Content-Type": "application/json"
  };
  
  async function getNFTs() {
    const url = `${BASE_URL}/nfts?api-key=${process.env.API_KEY}`;
    try {
      const res = await axios.get(url, { headers });
      if (res.status === 200) {
        console.log("NFTs fetched successfully:", res.data);
        return res.data;
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        console.log("🔍 NFTs not found.");
        return { message: "NFTs not found for this wallet." };
      } else {
        throw new Error(`Failed to fetch NFTs: ${err.message}`);
      }
    }
  }
  
  
  async function getTokens() {
    const url = `${BASE_URL}/tokens?api-key=${process.env.API_KEY}`;
    try {
      const res = await axios.get(url, { headers });
      if (res.status === 200) {
        console.log("Tokens fetched successfully:", res.data);
        return res.data;
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        console.log("🔍 Tokens not found.");
        return { message: "Tokens not found for this wallet." };
      } else {
        throw new Error(`Failed to fetch tokens: ${err.message}`);
      }
    }
  }
  
  
  async function getTransactions() {
    const url = `${BASE_URL}/transactions?api-key=${process.env.API_KEY}`;
    const res = await axios.get(url, { headers });
    return res.data;
  }
  
  async function dumpWalletData() {
    console.log("📦 Fetching NFTs...");
    const nfts = await getNFTs();
  
    console.log("💰 Fetching Tokens...");
    const tokens = await getTokens();
  
    console.log("🧾 Fetching Transactions...");
    const transactions = await getTransactions();
  
    console.log("\n✅ Dump Result:");
    console.dir({
      NFTs: nfts,
      Tokens: tokens,
      Transactions: transactions
    }, { depth: null });
  }
  
  dumpWalletData().catch(err => console.error("🚨 Error:", err.message));