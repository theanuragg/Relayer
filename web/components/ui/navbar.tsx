'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import useTransactionStore from '../../store/transactionstore';

export default function Navbar() {
  const { publicKey } = useWallet();
  const [inputValue, setInputValue] = useState('');
  
  const { 
    walletAddress,
    manualAddress,
    setWalletAddress,
    setManualAddress,
    connectWebSocket,
    initializeData
  } = useTransactionStore();
  
  // Handle connected wallet changes
  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [publicKey, setWalletAddress]);
  
  // Initialize with stored manual address if available
  useEffect(() => {
    if (manualAddress && !walletAddress) {
      setInputValue(manualAddress);
    }
  }, [manualAddress, walletAddress]);
  
  // Handle manual address submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue && inputValue.trim() !== '') {
      setManualAddress(inputValue);
      
      // Only apply the manual address if no wallet is connected
      if (!walletAddress) {
        initializeData(inputValue);
        connectWebSocket(inputValue);
      }
    }
  };
  
  return (
    <nav className="bg-[#000206] py-4 px-6 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">Solana Explorer</div>
      
      <form onSubmit={handleAddressSubmit} className="flex-grow max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter wallet address..."
            className="w-full bg-white py-3 px-4 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!!walletAddress} // Disable when wallet is connected
          />
          {!walletAddress && (
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Search
            </button>
          )}
          
          {walletAddress && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              Using connected wallet
            </div>
          )}
        </div>
      </form>
      
      <div className="flex items-center space-x-4">
        <WalletMultiButton />
      </div>
    </nav>
  );
}