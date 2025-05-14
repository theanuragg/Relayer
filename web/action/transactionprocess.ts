import { WebSocketTransaction, GraphData, Node, Link } from '@/types/transactiontypes';

// Format addresses for labels
const formatAddress = (address: string): string => {
  if (!address) return "Unknown";
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Create graph node
const createNode = (address: string, mainWallet: string): Node => {
  return {
    id: address,
    label: formatAddress(address),
    fullAddress: address,
    isMainWallet: address === mainWallet,
  };
};

export class TransactionProcessor {
  private mainWallet: string;
  
  constructor(mainWallet: string) {
    this.mainWallet = mainWallet;
  }
  
  // Add a method to update the main wallet address
  setMainWallet(walletAddress: string) {
    this.mainWallet = walletAddress;
  }

  processTransactions(transactions: WebSocketTransaction[]): GraphData {
    const uniqueNodes = new Map<string, Node>();
    const links: Link[] = [];
    
    // Log for debugging
    console.log("Processing transactions:", transactions.length);
    
    transactions.forEach((tx) => {
      const { from, to, amount, signature } = tx;
      
      // Basic validation
      if (from && to && amount !== null && signature) {
        // Create nodes if they don't exist
        if (!uniqueNodes.has(from)) {
          uniqueNodes.set(from, createNode(from, this.mainWallet));
        }
        if (!uniqueNodes.has(to)) {
          uniqueNodes.set(to, createNode(to, this.mainWallet));
        }
        
        // Push link
        links.push({
          id: signature.substring(0, 8),
          source: from,
          target: to,
          amount,
          signature,
          description: tx.description || `${formatAddress(from)} transferred ${amount} SOL to ${formatAddress(to)}`
        });
      }
      
      // Fallback type
      else if (tx.signature && tx.type === "TRANSFER") {
        const fallbackTo = tx.signature.substring(0, 32);
        const fallbackAmount = 0.1;
        
        if (!uniqueNodes.has(this.mainWallet)) {
          uniqueNodes.set(this.mainWallet, createNode(this.mainWallet, this.mainWallet));
        }
        if (!uniqueNodes.has(fallbackTo)) {
          uniqueNodes.set(fallbackTo, createNode(fallbackTo, this.mainWallet));
        }
        
        links.push({
          id: tx.signature.substring(0, 8),
          source: this.mainWallet,
          target: fallbackTo,
          amount: fallbackAmount,
          signature: tx.signature,
          description: `Transaction: ${tx.signature.substring(0, 8)}...`
        });
      }
    });
    
    const result = {
      nodes: Array.from(uniqueNodes.values()),
      links
    };
    
    // Log the output for debugging
    console.log("Generated graph data:", result);
    
    return result;
  }
}