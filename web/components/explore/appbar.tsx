'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import useTransactionStore from '../../store/transactionstore';

export default function AppBar() {
  const [inputValue, setInputValue] = useState('');
  const sendWalletQuery = useTransactionStore((state) => state.sendWalletQuery);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      sendWalletQuery(trimmed);
      setInputValue('');
      console.log("Wallet address sent to WebSocket:", trimmed);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex w-full justify-between mx-auto bg-background/50 backdrop-blur-md border-b border-primary/10 p-4 md:p-4 z-[100]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold custom-heading2">Relayer</h1>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter wallet address"
              className="pl-8 pr-4 py-2 rounded-md bg-gray-700 text-blue-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
          </div>
          <button 
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-blue-50 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
