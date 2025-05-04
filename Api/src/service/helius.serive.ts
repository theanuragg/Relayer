import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Check for required environment variables
const API_KEY = process.env.API_KEY;
const WALLET = process.env.WALLET;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

if (!WALLET) {
  throw new Error("WALLET is not defined in environment variables");
}

const BASE_URL = `https://api.helius.xyz/v0`;
const headers = { "Content-Type": "application/json" };

/**
 * Fetches NFTs associated with the wallet
 */
export async function getNFTs() {
  const url = `${BASE_URL}/addresses/${WALLET}/nfts?api-key=${API_KEY}`;

  try {
    const res = await axios.get(url, { headers });
    console.log("hye", typeof res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching NFTs: ${err.message}`);
    if (err.response?.status === 404) {
      console.log("🔍 NFTs not found.");
      return { message: "NFTs not found for this wallet." };
    }
    
  }
}

/**
 * Fetches tokens associated with the wallet
 */
export async function getTokens() {
  const url = `https://api.helius.xyz/v0/addresses/${WALLET}/tokens?api-key=${API_KEY}`;

  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching tokens: ${err.message}`);
    if (err.response?.status === 404) {
      console.log("🔍 Tokens not found.");
      return { message: "Tokens not found for this wallet." };
    }
  }
}

/**
 * Fetches transactions associated with the wallet
 */
export async function getTransactions() {
  const url = `${BASE_URL}/addresses/${WALLET}/transactions?api-key=${API_KEY}`;

  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching transactions: ${err.message}`);
    if (err.response?.status === 404) {
      console.log("🔍 Transactions not found.");
      return { message: "Transactions not found for this wallet." };
    }
    throw new Error(`Failed to fetch transactions: ${err.message}`);
  }
}

/**
 * Fetches Program Derived Addresses (PDAs) associated with the wallet
 */
export async function getPDAs() {
  // Note: Check if this is the correct endpoint for PDAs
  const url = `${BASE_URL}/addresses/${WALLET}/pdas?api-key=${API_KEY}`;

  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching PDAs: ${err.message}`);
    if (err.response?.status === 404) {
      console.log("🔍 PDAs not found or not supported for this wallet.");
      return { message: "PDAs not found or not supported for this wallet." };
    }
    throw new Error(`Failed to fetch PDAs: ${err.message}`);
  }
}

/**
 * Fetches program metadata if the wallet is a program
 */
export async function getProgramInfo() {
  // If WALLET is a program ID
  const url = `${BASE_URL}/programs/${WALLET}/metadata?api-key=${API_KEY}`;

  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching program info: ${err.message}`);
    if (err.response?.status === 404) {
      console.log("🔍 Program info not found or wallet is not a program ID.");
      return {
        message: "Program info not found or wallet is not a program ID.",
      };
    }
    throw new Error(`Failed to fetch program info: ${err.message}`);
  }
}
