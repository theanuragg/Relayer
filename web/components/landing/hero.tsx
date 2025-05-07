'use client';

import Image from "next/image";
import { ShimmerButton } from "../ui/actionbutton";

const HeroSection = () => {
  return (
    <div className="bg-[#000206] w-full text-white py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left: Diamond Image with Blue Gradient Glow */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center relative">
          {/* Blue Gradient Circle Glow */}
          <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-800 rounded-full blur-3xl opacity-30 z-0 animate-pulse" />

          {/* Diamond Image */}
          <Image
            src="/diamond1.png"
            alt="Diamond"
            width={400}
            height={400}
            priority
            className="relative z-10"
          />
        </div>

        {/* Right: Text + Stats */}
        <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold custom-heading leading-tight">
            Relayer
            <span className="relative inline-block">
              <svg
                className="absolute bottom-0 left-0 w-full h-[20px] z-0"
                viewBox="0 0 200 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 15 C50 5, 150 25, 195 10"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 18 C60 10, 140 30, 190 15"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className=" mt-4 pb-4 custom-span ">
          Relationship layer for blockchain — a visual interface that shows how accounts are connected and interact over time.
          </p>

          {/* CTA Button */}
          <div className="mt-6 flex justify-center md:justify-start"> 
          <ShimmerButton>Connect</ShimmerButton>
          </div>
        </div>
      </div>

      {/* Floating Coins Image */}
      <div className="absolute right-32 bottom-0 w-[150px] md:w-[200px] opacity-80 z-0 animate-float">
        <Image
          src="/crypto.png"
          alt="Floating Coins"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default HeroSection;
