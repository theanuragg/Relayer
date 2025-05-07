import useTransactionStore from "../../store/transactionstore";

export default function RawDataViewer() {
  // Get the raw WebSocket data and transactions from the store
  const { rawMessage, transactions } = useTransactionStore();

  // Choose what to display - either the raw message or the latest processed transaction
  const displayData = rawMessage || (transactions && transactions.length > 0 ? transactions[0] : null);
  
  return (
    <div className="border rounded-lg shadow-lg bg-white p-4 mt-4 max-h-80 overflow-auto">
      <h3 className="font-semibold mb-2">Raw Transaction Data</h3>
      {displayData ? (
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(displayData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">No transaction data available</p>
      )}
      
      {/* Show the number of transactions processed */}
      {transactions && transactions.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Total transactions: {transactions.length}
        </div>
      )}
    </div>
  );
}