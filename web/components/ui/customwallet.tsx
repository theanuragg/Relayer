'use client';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CustomWalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div className="relative">
      {connected ? (
        <button
          onClick={disconnect}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Disconnect ({publicKey?.toBase58().slice(0, 4)}...)
        </button>
      ) : (
        <button
          onClick={() => setVisible(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
