

export interface WebSocketTransaction {
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
  
  export interface Node {
    id: string;
    label: string;
    fullAddress: string;
    isMainWallet: boolean;
  }
  
  export interface Link {
    id: string;
    source: string;
    target: string;
    amount: number;
    signature: string;
    description?: string;
  }
  
  export interface GraphData {
    nodes: Node[];
    links: GraphLink[];
  }
  
  export interface TransactionState {
    transactions: WebSocketTransaction[];
    rawMessage: unknown;
    error: string | null;
    graphData: GraphData;
    selectedElement: unknown;
    selectedType: string | null;
    connected: boolean;
    isLoading: boolean;
  }
  
  export interface TransactionActions {
    initializeData: () => void;
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    processTransactions: (transactions: WebSocketTransaction[]) => void;
    setSelectedElement: (element: unknown, type: string) => void;
    clearSelection: () => void;
    setError: (error: string | Error) => void;
    clearError: () => void;
  }


// Base Node type from the store
export interface Node {
  id: string;
  label: string;
  fullAddress: string;
  isMainWallet: boolean;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

// Link type from the store
export interface GraphLink {
  id: string;
  source: string | Node;
  target: string | Node;
  amount: number;
  signature: string;
  description?: string;
}

// GraphData type from store
export interface GraphData {
  nodes: Node[];
  links: GraphLink[];
}

// Transaction type for InfoPanel
export interface Transaction {
  amount: number;
  source: { id?: string } | string;
  target: { id?: string } | string;
  signature: string;
}
  
  export type TransactionStore = TransactionState & TransactionActions;

  