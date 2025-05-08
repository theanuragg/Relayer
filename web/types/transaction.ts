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
    links: Link[];
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
  
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    processTransactions: (txs: WebSocketTransaction[]) => void;
  }
  