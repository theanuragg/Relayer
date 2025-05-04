import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = `https://api-devnet.helius.xyz`;
const headers = { "Content-Type": "application/json" };

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

export async function getTransactions(wallet: string) {
  const url = `${BASE_URL}/v0/addresses/${wallet}/transactions?api-key=${API_KEY}`;

  console.log("Requesting URL:", url);

  try {
    const res = await axios.get(url, { headers });
    console.log("Transaction API Response:", res.data);
    console.log("Transaction API Status:", res.status);
    return res.data
  } catch (err: any) {
    if (err.response) {
      console.error("Error Response Status:", err.response.status);
      console.error("Error Response Data:", err.response.data);
    }
    throw new Error(`Failed to fetch transactions: ${err.message}`);
  }
}
