// import { useEffect, useState } from "react";

// // Define the structure of a native transfer
// interface NativeTransfer {
//   fromUserAccount: string;
//   toUserAccount: string;
//   amount: number; // in lamports
// }

// // Define the structure of a transaction
// export interface Transaction {
//   description?: string;
//   signature: string;
//   nativeTransfers: NativeTransfer[];
// }

// // Define the structure of incoming WebSocket data
// interface WebSocketData {
//   data?: {
//     transactions?: Transaction[];
//   };
//   [key: string]: unknown;
// }

// export default function useTransactionData() {
//   const [rawMessage, setRawMessage] = useState<WebSocketData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   useEffect(() => {
//     const sampleTransactions: Transaction[] = [
//       {
//         description: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS transferred 2.89258 SOL to 6UoCsHVFQ4oBv9yRxnjpbBTedJiWdneX4MEuvZwMKh66.",
//         signature: "23nwtMzka6TeL4zCsXww6nJSpB9sw5eQiecJ9E6VWVgtt9vCnQVtcphAaURMgSHfNBrvaYMcr9Y9BC49ytjss7rg",
//         nativeTransfers: [
//           {
//             fromUserAccount: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
//             toUserAccount: "6UoCsHVFQ4oBv9yRxnjpbBTedJiWdneX4MEuvZwMKh66",
//             amount: 2892580000,
//           },
//         ],
//       },
//       {
//         description: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS transferred 0.1 SOL to 6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d.",
//         signature: "3EJsc2WoRVyy3kS86QfC8soQqcVZrSySFjFZFp262QiR375ZEQiRismxi2fpvqMxYB1tHuPLFr7fkhDYnGt9uPdE",
//         nativeTransfers: [
//           {
//             fromUserAccount: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
//             toUserAccount: "6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d",
//             amount: 100000000,
//           },
//         ],
//       },
//     ];

//     setTransactions(sampleTransactions);

//     let socket: WebSocket;

//     try {
//       socket = new WebSocket("ws://localhost:8080");

//       socket.onopen = () => {
//         console.log("WebSocket connected");
//         socket.send(JSON.stringify({
//           wallet: "5jeASqLezFbqGsgLeNYKgb7ySzzpCXk7zXMTsxewXADS",
//         }));
//       };

//       socket.onmessage = (event) => {
//         try {
//           const data: WebSocketData = JSON.parse(event.data);
//           console.log("Received data:", data);
//           setRawMessage(data);
//           console.log("Raw message:", data);

//           if (data.data?.transactions) {
//             setTransactions(data.data.transactions);
//           }
//         } catch (err) {
//           console.error("Error parsing WebSocket message:", err);
//         }
//       };

//       socket.onerror = (err) => {
//         console.error("WebSocket error", err);
//         setError("WebSocket error");
//       };

//       socket.onclose = () => {
//         console.log("WebSocket closed");
//       };
//     } catch (err) {
//       console.error("Error creating WebSocket:", err);
//       setError("Error connecting to WebSocket server");
//     }

//     return () => {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.close();
//       }
//     };
//   }, []);

//   return { rawMessage, error, transactions };
// }
