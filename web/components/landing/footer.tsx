"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white py-10 px-6 md:px-20 rounded-xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* Logo + Tagline */}
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <div className="text-2xl font-bold custom-heading2">Relayer</div>
          <p className="text-sm text-gray-400">
            We’re building a relationship layer for blockchain — a visual interface that shows how accounts are connected and interact over time. Designed for devs, users, and analysts, it brings context to raw on-chain data without needing to sift through complex transaction logs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/not-found" className="hover:text-white">404</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Stay Social</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="https://www.linkedin.com/in/anurag-singh-2b7bb624a/"  className="hover:text-white">LinkedIn</a></li>
            <li><a href="https://x.com/theaanuragg" className="hover:text-white">X (Twitter)</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
