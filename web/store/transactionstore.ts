import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  TransactionStore,
  WebSocketTransaction,
} from '../types/transactiontypes';
import { sampleTransactions } from '../lib/transactionutils';
import { WebSocketService } from '../action/transaction';
import { TransactionProcessor } from '../action/transactionprocess';

// Initialize services
const transactionProcessor = new TransactionProcessor('default-wallet-address');

const useTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => {
        let webSocketService: WebSocketService | null = null;

        return {
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
            const graphData = transactionProcessor.processTransactions(sampleTransactions);
            set({
              transactions: sampleTransactions,
              graphData,
              isLoading: false
            });
          },

          connectWebSocket: () => {
            if (!webSocketService) {
              webSocketService = new WebSocketService(
                () => set({ connected: true }),
                () => set({ connected: false }),
                (data) => {
                  // Update raw message immediately
                  set({ rawMessage: data });
                  
                  // Process the incoming transaction data
                  const typedData = data as { transactions?: WebSocketTransaction[]; data?: { transactions?: WebSocketTransaction[] } };
                  
                  let incomingTransactions: WebSocketTransaction[] = [];
                  
                  if (typedData.transactions && Array.isArray(typedData.transactions)) {
                    incomingTransactions = typedData.transactions;
                  } else if (typedData.data?.transactions && Array.isArray(typedData.data.transactions)) {
                    incomingTransactions = typedData.data.transactions;
                  }
                  
                  // Only process if we actually received transactions
                  if (incomingTransactions.length > 0) {
                    // Generate new graph data based on these transactions
                    const newGraphData = transactionProcessor.processTransactions(incomingTransactions);
                    
                    // Update state with both transactions and new graph data
                    set({
                      transactions: incomingTransactions,
                      graphData: newGraphData
                    });
                  }
                },
                (error) => set({ error, connected: false })
              );
            }

            webSocketService.connect();
          },

          disconnectWebSocket: () => {
            if (webSocketService) {
              webSocketService.disconnect();
            }
          },

          sendWalletQuery: (walletAddress: string) => {
            if (webSocketService) {
              // Update the processor's main wallet address
              transactionProcessor.setMainWallet(walletAddress);
              // Send the query
              webSocketService.sendWalletAddress(walletAddress);
            } else {
              console.warn("WebSocket service not initialized");
            }
          },

          processTransactions: (transactions: WebSocketTransaction[]) => {
            const newGraphData = transactionProcessor.processTransactions(transactions);
            set({
              transactions,
              graphData: newGraphData
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
        };
      },
      {
        name: 'transaction-storage',
        partialize: (state) => ({
          transactions: state.transactions,
          graphData: state.graphData
        })
      }
    )
  )
);

export default useTransactionStore;