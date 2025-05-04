"use client";

import { useEffect, useState } from "react";

interface Transaction {
  signature: string;
  description: string;
  type: string;
  fee: number;
}

export default function TransactionList({ walletAddress }: { walletAddress: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/transactions/${walletAddress}`);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTxns();
  }, [walletAddress]);

  if (loading) return <p>Loading...</p>;
  if (!transactions.length) return <p>No transactions found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li key={tx.signature} className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Type:</strong> {tx.type}</p>
            <p><strong>Description:</strong> {tx.description || "N/A"}</p>
            <p><strong>Signature:</strong> {tx.signature}</p>
            <p><strong>Fee:</strong> {tx.fee / 1e9} SOL</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
