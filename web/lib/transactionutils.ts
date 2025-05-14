import { Wallet } from 'lucide-react';
import { Node } from '@/types/transactiontypes';

// Constants
export const MAIN_WALLET = "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS";
export const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER

// Helper functions
export const formatAddress = (address: string): string => {
  if (!address) return "Unknown";
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

export const createNode = (address: string): Node => {
  return {
    id: address,
    label: formatAddress(address),
    fullAddress: address,
    isMainWallet: address === MAIN_WALLET
  };
};

// Sample data for initial rendering
export const sampleTransactions = [
  {
    wallet:"",
    signature: "23nwtMzka6TeL4zCsXww6nJSpB9sw5eQiecJ9E6VWVgtt9vCnQVtcphAaURMgSHfNBrvaYMcr9Y9BC49ytjss7rg",
    timestamp: 1746339692,
    fee: 80000,
    type: "TRANSFER",
    status: "confirmed",
    from: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
    to: "6UoCsHVFQ4oBv9yRxnjpbBTedJiWdneX4MEuvZwMKh66",
    amount: 2.89258,
    tokenAddress: null
  },
  {
    wallet:"",
    signature: "3EJsc2WoRVyy3kS86QfC8soQqcVZrSySFjFZFp262QiR375ZEQiRismxi2fpvqMxYB1tHuPLFr7fkhDYnGt9uPdE",
    timestamp: 1744994043,
    fee: 80000,
    type: "TRANSFER",
    status: "confirmed",
    from: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
    to: "6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d",
    amount: 0.1,
    tokenAddress: null
  }
];