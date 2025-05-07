'use client';

import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import HeroSection from '@/components/landing/hero';
import GettingStarted from '@/components/landing/howitstart';
import RewardCard from '@/components/landing/rewardcard';

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
    <main  className=' bg-[#000206] py-20'>
      {/* <WalletMultiButton /> */}
      <HeroSection/>
      <GettingStarted/>
      <div className="pt-40">
      <RewardCard/>
      </div>
    </main>
  );
}
