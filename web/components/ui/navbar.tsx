'use client';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

 export default function Navbar() {
 return (
    <nav className="bg-[#000206] py-4 px-6 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">Solana Explorer</div>
      <input className=' bg-white py-4 px-8 focus:ring-0' onClick=  {()=> {
        console.log("Input clicked");
        const activeElement = document.activeElement as HTMLElement | null;
        activeElement?.blur();
        if (activeElement) {
          activeElement.style.outline = 'none';
        }
      }}></input>
        <div className="flex items-center space-x-4">
            <WalletMultiButton/>
        </div>
    </nav>
 )
 }