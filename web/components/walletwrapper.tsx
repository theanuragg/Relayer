'use client';

import { WalletConnectionProvider } from "@/components/walletconnection";

export default function ClientWalletWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletConnectionProvider>{children}</WalletConnectionProvider>;
}
