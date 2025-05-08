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

// Create the store with a more organized structure
const useTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => {
        // Create WebSocketService instance with callbacks from the store
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
            // Process sample data immediately for initial render
            const graphData = transactionProcessor.processTransactions(sampleTransactions);
            set({ 
              transactions: sampleTransactions,
              graphData,
              isLoading: false 
            });
          },
          
          connectWebSocket: () => {
            // Lazy instantiation of WebSocketService
            if (!webSocketService) {
              webSocketService = new WebSocketService(
                // onConnected
                () => set({ connected: true }),
                // onDisconnected
                () => set({ connected: false }),
                // onMessage
                (data) => {
                  set({ rawMessage: data });
                  
                  // Type assertion for data
                  const typedData = data as { transactions?: WebSocketTransaction[]; data?: { transactions?: WebSocketTransaction[] } };
                  
                  // Check if we received transaction data
                  if (typedData.transactions && Array.isArray(typedData.transactions)) {
                    get().processTransactions(typedData.transactions);
                  } else if (typedData.data && typedData.data.transactions) {
                    get().processTransactions(typedData.data.transactions);
                  }
                },
                // onError
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
          // Only persist these fields
          transactions: state.transactions,
          graphData: state.graphData
        })
      }
    )
  )
);

export default useTransactionStore;
