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
const transactionProcessor = new TransactionProcessor();

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
                  set({ rawMessage: data });
                  const typedData = data as { transactions?: WebSocketTransaction[]; data?: { transactions?: WebSocketTransaction[] } };

                  if (typedData.transactions && Array.isArray(typedData.transactions)) {
                    get().processTransactions(typedData.transactions);
                  } else if (typedData.data?.transactions) {
                    get().processTransactions(typedData.data.transactions);
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
              webSocketService.sendWalletAddress(walletAddress);
            } else {
              console.warn("WebSocket service not initialized");
            }
          },

          processTransactions: (transactions: WebSocketTransaction[]) => {
            const graphData = transactionProcessor.processTransactions(transactions);
            set({
              transactions,
              graphData
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
