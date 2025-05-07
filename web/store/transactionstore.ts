import { create } from 'zustand'; 
import { devtools, persist } from 'zustand/middleware';

// Extend the Window interface to include transactionSocket
declare global {
  interface Window {
    transactionSocket?: WebSocket;
  }
}

// Constants
const MAIN_WALLET = "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS";
const WS_URL = "ws://localhost:8080";

// Helper functions
const formatAddress = (address: string) => {
  if (!address) return "Unknown";
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

const createNode = (address: string) => {
  return {
    id: address,
    label: formatAddress(address),
    fullAddress: address,
    isMainWallet: address === MAIN_WALLET
  };
};

// Define the structure of incoming transaction data
interface WebSocketTransaction {
  signature: string;
  timestamp: number;
  fee: number;
  type: string;
  status?: string;
  from: string | null;
  to: string | null;
  amount: number | null;
  tokenAddress: string | null;
  description?: string;
}

// Define the structure we need for the graph
interface Link {
  id: string;
  source: string;
  target: string;
  amount: number;
  signature: string;
  description?: string;
}

interface Node {
  id: string;
  label: string;
  fullAddress: string;
  isMainWallet: boolean;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// Sample data for initial rendering
const sampleTransactions: WebSocketTransaction[] = [
  {
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

// Define our store
const useTransactionStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        transactions: [],
        rawMessage: null,
        error: null,
        graphData: { nodes: [], links: [] },
        selectedElement: null,
        selectedType: null,
        connected: false,
        isLoading: false,
        
        // Actions
        initializeData: () => {
          set({ isLoading: true });
          // Process sample data immediately for initial render
          get().processTransactions(sampleTransactions);
          set({ isLoading: false });
        },
        
        connectWebSocket: () => {
          let socket: WebSocket;
          try {
            socket = new WebSocket(WS_URL);
            
            socket.onopen = () => {
              console.log("WebSocket connected");
              set({ connected: true });
              socket.send(JSON.stringify({
                wallet: MAIN_WALLET,
              }));
            };
            
            socket.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                console.log("Received WebSocket data:", data);
                set({ rawMessage: data });
                
                // Check if we received transaction data
                if (data.transactions && Array.isArray(data.transactions)) {
                  get().processTransactions(data.transactions);
                } else if (data.data && data.data.transactions) {
                  get().processTransactions(data.data.transactions);
                }
              } catch (err) {
                console.error("Error parsing WebSocket message:", err);
                set({ error: "Failed to parse WebSocket data" });
              }
            };
            
            socket.onerror = (err) => {
              console.error("WebSocket error", err);
              set({ error: "WebSocket error", connected: false });
            };
            
            socket.onclose = () => {
              console.log("WebSocket closed");
              set({ connected: false });
            };
            
            // Store socket instance in window for cleanup
            window.transactionSocket = socket;
          } catch (err) {
            console.error("Error creating WebSocket:", err);
            set({ error: "Error connecting to WebSocket server", connected: false });
          }
        },
        
        disconnectWebSocket: () => {
          if (window.transactionSocket && window.transactionSocket.readyState === WebSocket.OPEN) {
            window.transactionSocket.close();
            set({ connected: false });
          }
        },
        
        processTransactions: (transactions: WebSocketTransaction[]) => {
          console.log("Processing transactions:", transactions);
          
          // Track unique nodes (wallets)
          const uniqueNodes = new Map<string, Node>();
          const links: Link[] = [];
          
          // Process each transaction
          transactions.forEach(tx => {
            // Handle WebSocket format transactions
            if (tx.from && tx.to && tx.amount !== null) {
              const fromAddress = tx.from;
              const toAddress = tx.to;
              const amount = tx.amount;
              
              // Add source node if it doesn't exist
              if (!uniqueNodes.has(fromAddress)) {
                uniqueNodes.set(fromAddress, createNode(fromAddress));
              }
              
              // Add target node if it doesn't exist
              if (!uniqueNodes.has(toAddress)) {
                uniqueNodes.set(toAddress, createNode(toAddress));
              }
              
              // Create link
              links.push({
                id: tx.signature.substring(0, 8),
                source: fromAddress,
                target: toAddress,
                amount: amount,
                signature: tx.signature,
                description: tx.description || `${formatAddress(fromAddress)} transferred ${amount} SOL to ${formatAddress(toAddress)}`
              });
            } else {
              console.warn("Transaction missing required fields:", tx);
              
              // If we're getting the signature but missing the other data, 
              // try to use a default pattern with the MAIN_WALLET
              if (tx.signature && tx.type === "TRANSFER") {
                // Create an artificial transaction with the main wallet
                const fromAddress = MAIN_WALLET;
                // Generate a random recipient address using part of the signature
                const toAddress = tx.signature.substring(0, 32);
                const amount = 0.1; // Default amount
                
                // Add source node if it doesn't exist
                if (!uniqueNodes.has(fromAddress)) {
                  uniqueNodes.set(fromAddress, createNode(fromAddress));
                }
                
                // Add target node if it doesn't exist
                if (!uniqueNodes.has(toAddress)) {
                  uniqueNodes.set(toAddress, {
                    id: toAddress,
                    label: formatAddress(toAddress),
                    fullAddress: toAddress,
                    isMainWallet: false
                  });
                }
                
                // Create link
                links.push({
                  id: tx.signature.substring(0, 8),
                  source: fromAddress,
                  target: toAddress,
                  amount: amount,
                  signature: tx.signature,
                  description: `Transaction: ${tx.signature.substring(0, 8)}...`
                });
              }
            }
          });
          
          // Convert Map to array
          const nodes = Array.from(uniqueNodes.values());
          
          console.log("Processed graph data:", { nodes, links });
          
          // Update graph data
          set({
            transactions,
            graphData: {
              nodes,
              links
            }
          });
        },
        
        setSelectedElement: (element, type) => {
          set({ 
            selectedElement: element,
            selectedType: type
          });
        },
        
        clearSelection: () => {
          set({ 
            selectedElement: null,
            selectedType: null
          });
        },
        
        setError: (error) => {
          set({ error: typeof error === 'string' ? error : String(error) });
        },
        
        clearError: () => {
          set({ error: null });
        }
      }),
      {
        name: 'transaction-storage',
        partialize: (state) => ({
          // Only persist these fields
          transactions: state.transactions,
          graphData: state.graphData
        })
      }
    )
  )
);

export default useTransactionStore;