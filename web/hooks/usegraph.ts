// import { useEffect, useState } from "react";

// interface NativeTransfer {
//   fromUserAccount: string;
//   toUserAccount: string;
//   amount: number;
// }

// interface Transaction {
//   nativeTransfers: NativeTransfer[];
//   signature: string;
//   description?: string;
// }

// interface Node {
//   id: string;
//   label: string;
//   fullAddress: string;
//   isMainWallet: boolean;
// }

// interface Link {
//   id: string;
//   source: string;
//   target: string;
//   amount: number;
//   signature: string;
//   description?: string;
// }

// export default function useGraphData(transactions: Transaction[] | null) {
//   const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
//     nodes: [],
//     links: [],
//   });

//   useEffect(() => {
//     if (!transactions || transactions.length === 0) return;
//     processTransactions(transactions);
//   }, [transactions]);

//   // Process transactions into graph data
//   const processTransactions = (transactions: Transaction[]) => {
//     const uniqueNodes = new Map<string, Node>();
//     const newLinks: Link[] = [];

//     transactions.forEach((tx) => {
//       if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
//         tx.nativeTransfers.forEach((transfer) => {
//           const fromAddress = transfer.fromUserAccount;
//           const toAddress = transfer.toUserAccount;
//           const amount = transfer.amount / 1_000_000_000; // Convert lamports to SOL

//           if (!uniqueNodes.has(fromAddress)) {
//             uniqueNodes.set(fromAddress, createNode(fromAddress));
//           }

//           if (!uniqueNodes.has(toAddress)) {
//             uniqueNodes.set(toAddress, createNode(toAddress));
//           }

//           newLinks.push(createLink(tx, fromAddress, toAddress, amount));
//         });
//       }
//     });

//     const newNodes = Array.from(uniqueNodes.values());

//     setGraphData({
//       nodes: newNodes,
//       links: newLinks,
//     });
//   };

//   const createNode = (address: string): Node => {
//     const MAIN_WALLET = "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS";
//     return {
//       id: address,
//       label: formatAddress(address),
//       fullAddress: address,
//       isMainWallet: address === MAIN_WALLET,
//     };
//   };

//   const createLink = (
//     tx: Transaction,
//     source: string,
//     target: string,
//     amount: number
//   ): Link => {
//     return {
//       id: tx.signature.substring(0, 8),
//       source,
//       target,
//       amount,
//       signature: tx.signature,
//       description: tx.description,
//     };
//   };

//   const formatAddress = (address: string): string => {
//     return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
//   };

//   return graphData;
// }
