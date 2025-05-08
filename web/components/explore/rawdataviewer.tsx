"use client";

import React from "react";
import useTransactionStore from "../../store/transactionstore";
import { Copy } from "lucide-react";

export default function RawDataViewer() {
  const { transactions } = useTransactionStore();

  return (
    <div className="bg-[#10151b] rounded-lg shadow-lg p-4 mt-6 max-h-[500px] md:max-h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-semibold text-lg">
          Transaction History
        </h2>
        <button className="text-sm text-blue-400 border border-blue-600 rounded px-2 py-1 hover:bg-blue-900">
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="uppercase text-xs text-gray-500 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4">Transaction Signature</th>
              <th className="px-6 py-4">Block</th>
              <th className="px-6 py-4">Result</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No transaction data available
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-[#1b2128] transition"
                >
                  <td className="px-3 py-2 flex items-center gap-2">
                    <span className="break-all">{tx.signature}</span>
                    <Copy
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() =>
                        navigator.clipboard.writeText(tx.signature)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">{tx.timestamp || "-"}</td>
                  <td className="px-3 py-2">
                    <span className="bg-blue-800 text-blue-300 text-xs px-2 py-1 rounded">
                      Success
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
