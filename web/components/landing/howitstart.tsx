'use client';

import Image from 'next/image';
import { FaCoins, FaLock } from 'react-icons/fa';
import { MagicCard } from '../ui/magiccard';
// import { cn } from "@/lib/utils"; // Optional if you use clsx or cn utility

export default function GettingStarted() {
  return (
    <section className="py-20 bg-[#000206] text-white text-center px-4 relative overflow-hidden">
      <h2 className="text-4xl font-bold mb-4 custom-heading3">How it work</h2>
      <p className="text-gray-400 mb-16 custom-span">
        Select wallet address and see your transaction logs txn.
      </p>

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-20 max-w-6xl mx-auto">
        {/* Left Card */}
        <StepCard
          icon={<FaCoins className="text-3xl text-blue-400" />}
          title="Choose Your wallet"
          description="would you like see your txn logs."
        />

        

        {/* Center Lightning */}
        <div className="relative z-10">
          <div className=" w-8 h-14 rounded-full flex items-center justify-center shadow-lg animate-pulse  ">
            <Image src='/bolt.webp' alt='' fill />
          </div>
        </div>

        {/* Right Card */}
        <StepCard
          icon={<FaLock className="text-3xl text-blue-400" />}
          title="Search your address"
          description="put your address search."
        />
      </div>

      
    </section>
  );
}

function StepCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <MagicCard >
    <div className="relative rounded-xl px-8 py-8 w-full max-w-xs border border-blue-50">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 custom-heading2">{title}</h3>
      <p className="text-gray-400 custom-span">{description}</p>
    </div>
    </MagicCard>
  );
}
