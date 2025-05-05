'use client';

import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function HomePage() {
  const { publicKey } = useWallet();
  const [userPubkey, setUserPubkey] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      setUserPubkey(publicKey.toString());
      console.log("User public key:", publicKey.toString());
    }
  }, [publicKey]);

  return (
    <main className="p-8">
      <WalletMultiButton />
      {userPubkey && (
        <p className="mt-4">🔑 Your public key: {userPubkey}</p>
      )}
    </main>
  );
}
