'use client';
import { FaInfoCircle } from "react-icons/fa";

export default function Legend() {
  return (
    <div className="bg-yellow-100 text-yellow-900 rounded-xl p-6 shadow-md space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <FaInfoCircle className="text-xl text-yellow-700" />
        <h1 className="text-lg font-semibold">How to Use</h1>
      </div>

      <p className="text-sm">
        Enter your <strong>public address</strong> to view your transaction history.
      </p>
      <p className="text-sm">
        Currently supports <strong>Mainnet</strong> only. 
        <br />
        <em>Devnet support is coming soon....</em>
      </p>
    </div>
  );
}
