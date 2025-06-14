'use client';

import Image from 'next/image';
import { ShimmerButton } from '../ui/actionbutton';
import { useRouter } from 'next/navigation';

export default function RewardCard() {
  const router = useRouter(); 

  return (
    <div className="relative bg-[radial-gradient(circle_at_center_bottom,#000000_30%,#0b2c7e_100%,#051739_100%)] rounded-2xl p-10 flex flex-col  md:flex-row items-center justify-between overflow-hidden border border-[#1d2845] shadow-xl max-w-5xl mx-auto">
      
      {/* Left icons or image */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
        <Image
          src="/coins.svg"
          alt="Crypto Icons"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      {/* Right Text */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
        <h2 className="text-xl font-bold text-white custom-heading4">Start Visualize your wallet</h2>
        <p className="text-gray-300 custom-span">
          Don’t just use typical explorer .
        </p>
        <ShimmerButton onClick={() => router.push('/ex')}>
          get started
        </ShimmerButton>
      </div>
    </div>
  );
}
