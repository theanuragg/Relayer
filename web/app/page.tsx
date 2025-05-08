'use client';

import React from 'react';
import HeroSection from '@/components/landing/hero';
import GettingStarted from '@/components/landing/howitstart';
import RewardCard from '@/components/landing/rewardcard';

export default function HomePage() {

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
