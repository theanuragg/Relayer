import { getTransactions } from "../service/helius.serive";

export async function dumpWalletData(wallet: string) {
  console.log(" Fetching Transactions for wallet:", wallet);

  const transactions = await getTransactions(wallet);

  return { transactions };
}
