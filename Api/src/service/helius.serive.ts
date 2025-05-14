// service/helius.service.ts
import axios from "axios";
import dotenv from "dotenv";
import redis from "../lib/redis"; // 👈 import Redis client

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = `https://api-devnet.helius.xyz`;
const headers = { "Content-Type": "application/json" };

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

function normalizeTransactions(rawTransactions: any[]) {
  return rawTransactions.map((tx) => {
    const transfer = tx.events?.transfer || {};

    return {
      signature: tx.signature,
      timestamp: tx.timestamp,
      fee: tx.fee,
      type: tx.type,
      status: tx.status,
      from: transfer.source || null,
      to: transfer.destination || null,
      amount: transfer.amount || null,
      tokenAddress: transfer.tokenAddress || null,
    };
  });
}

export async function getTransactions(wallet: string) {
  const cacheKey = `wallet:tx:${wallet}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log(" Cache hit for", wallet);
    return JSON.parse(cachedData);
  }

  const url = `${BASE_URL}/v0/addresses/${wallet}/transactions?api-key=${API_KEY}`;
  console.log(" Requesting:", url);

  try {
    const res = await axios.get(url, { headers });
    console.log(" Fetched from API:", res.status);

    const normalized = normalizeTransactions(res.data);

    // Cache the normalized data
    await redis.set(cacheKey, JSON.stringify(normalized), 'EX', 60);

    return normalized;
  } catch (err: any) {
    console.error("❌ Failed API call");
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    throw new Error(`Failed to fetch transactions: ${err.message}`);
  }
}
