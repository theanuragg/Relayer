'use client';

import React from 'react';
import HeroSection from '@/components/landing/hero';
import GettingStarted from '@/components/landing/howitstart';
import RewardCard from '@/components/landing/rewardcard';
import Footer from '@/components/landing/footer';

export default function HomePage() {
  return (
    <>
      <main className="py-20">
        {/* <WalletMultiButton /> */}
        <HeroSection />
        <GettingStarted />
        <div className="pt-40">
          <RewardCard />
        </div>
      </main>
      <footer className='px-40 pt-40 rounded-md'>
        <Footer />
      </footer>
    </>
  );
}
