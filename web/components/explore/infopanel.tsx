'use client';

import  useTransactionStore  from '@/store/transactionstore'; // Update path as needed
import { Node, Transaction } from '@/types/transactiontypes';

function NodeInfo({ node }: { node: Node }) {
  return (
    <>
      <h3 className="font-bold text-lg mb-2">Wallet Address</h3>
      <p className="break-all mb-2">{node.fullAddress}</p>
      {node.isMainWallet && (
        <p className="text-sm bg-red-100 p-1 rounded">Main Wallet</p>
      )}
    </>
  );
}

function TransactionInfo({ transaction }: { transaction: Transaction }) {
  return (
    <>
      <h3 className="font-bold text-lg mb-2">Transaction</h3>
      <p className="mb-2">
        <span className="font-semibold">Amount:</span> {transaction.amount.toFixed(4)} SOL
      </p>
      <p className="mb-2">
        <span className="font-semibold">From:</span>{" "}
        <span className="break-all">
          {typeof transaction.source === 'object' && transaction.source.id ? transaction.source.id : String(transaction.source)}
        </span>
      </p>
      <p className="mb-2">
        <span className="font-semibold">To:</span>{" "}
        <span className="break-all">
          {typeof transaction.target === 'object' && transaction.target.id ? transaction.target.id : String(transaction.target)}
        </span>
      </p>
      <p className="mb-2">
        <span className="font-semibold">Signature:</span>{" "}
        <span className="break-all text-xs">
          {transaction.signature}
        </span>
      </p>
    </>
  );
}

export default function InfoPanel() {
  // Get state and actions from the refactored store
  const { selectedElement, selectedType, clearSelection } = useTransactionStore();

  // Using the clearSelection function directly from the store now
  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <div className="absolute top-2 right-2 bg-white border shadow-md p-4 rounded max-w-xs">
      {selectedType === 'node' && <NodeInfo node={selectedElement as Node} />}
      {selectedType === 'link' && <TransactionInfo transaction={selectedElement as Transaction} />}
      
      <button 
        onClick={handleClearSelection}
        className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Close
      </button>
    </div>
  );
}

// RawDataViewer.tsx

