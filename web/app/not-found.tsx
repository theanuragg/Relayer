// app/not-found.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b2c7e] to-[#051739] text-white px-6">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/notfound.avif"
            alt="404 Illustration"
            width={300}
            height={300}
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Side Text */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 custom-heading3">No Results Found</h1>
          <p className="text-gray-300 mb-6 custom-span">
            We couldn’t find what you searched for. Try searching again.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
