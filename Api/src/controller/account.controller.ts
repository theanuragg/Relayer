// src/controllers/walletController.ts
import {
    getNFTs,
    getTokens,
    getTransactions,
    getPDAs,
    getProgramInfo
  } from "../service/helius.serive";
  
  export async function dumpWalletData() {
    console.log(" Fetching NFTs...");
    const nfts = await getNFTs();
  
    console.log(" Fetching Tokens...");
    const tokens = await getTokens();
  
    // console.log(" Fetching Transactions...");
    // const transactions = await getTransactions();
  
    // console.log("🔐 Fetching PDA 
    // Accounts...");
    // const pdas = await getPDAs();
  
    // console.log("📘 Fetching Program Metadata...");
    // const programInfo = await getProgramInfo();
  
    console.log("\n✅ Dump Result:");
    console.dir({
      NFTs: nfts,
      Tokens: tokens,
    //   Transactions: transactions,
      // PDAs: pdas,
      // ProgramMetadata: programInfo
    }, { depth: null });
  }
  