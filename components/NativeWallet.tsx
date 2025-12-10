
import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import { createWallet, fetchWalletBalance } from '../services/simService';

interface NativeWalletProps {
  onWalletChange: (wallet: WalletState) => void;
}

export const NativeWallet: React.FC<NativeWalletProps> = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: '0.00',
    isConnected: false,
    isLoading: false
  });

  const [isOpen, setIsOpen] = useState(false);

  // Initial load check
  useEffect(() => {
    const savedAddress = localStorage.getItem('bukeqi_wallet_address');
    if (savedAddress) {
      handleSync(savedAddress);
    }
  }, []);

  const handleSync = async (address: string) => {
    setWallet(prev => ({ ...prev, isLoading: true, isConnected: true, address }));
    const bal = await fetchWalletBalance(address);
    const updated = {
        address,
        balance: bal,
        isConnected: true,
        isLoading: false
    };
    setWallet(updated);
    onWalletChange(updated);
  };

  const handleCreateWallet = () => {
    setIsOpen(false);
    const newWallet = createWallet();
    if (newWallet.address) {
        handleSync(newWallet.address);
    }
  };

  const disconnect = () => {
      localStorage.removeItem('bukeqi_wallet_address');
      const reset = { address: null, balance: '0.00', isConnected: false, isLoading: false };
      setWallet(reset);
      onWalletChange(reset);
      setIsOpen(false);
  }

  return (
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex flex-col items-end">
      
      {!wallet.isConnected ? (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/80 backdrop-blur text-cyan-400 border border-cyan-500/30 hover:border-cyan-500 font-cyber font-bold px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm rounded-lg hover:bg-cyan-950/30 transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)] flex items-center gap-2 group"
        >
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
          INIT_BURNER_WALLET
        </button>
      ) : (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-top-2">
            {/* Main Badge */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center gap-3 bg-black/90 backdrop-blur-md border border-cyan-500/20 px-4 py-2 rounded-xl shadow-lg hover:border-cyan-500/50 transition-colors"
            >
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] text-gray-500">Bu Ke Qi Burner</span>
                    <span className="font-cyber text-white text-sm tracking-wider">
                        {wallet.address?.substring(0, 6)}...{wallet.address?.substring(38)}
                    </span>
                </div>
                <div className="h-8 w-[1px] bg-gray-800"></div>
                <div className="flex flex-col items-end min-w-[60px]">
                     {wallet.isLoading ? (
                         <span className="text-[10px] text-cyan-500 animate-pulse">SYNCING...</span>
                     ) : (
                         <span className="font-bold text-cyan-400 text-sm">{wallet.balance} MON</span>
                     )}
                </div>
            </div>
            
            {/* Sub Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-900/80 rounded border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[8px] font-mono text-gray-400">DUNE SIM CONNECTED</span>
            </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
         <div className="absolute top-full mt-2 right-0 w-64 bg-black/95 border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col gap-3">
            {!wallet.isConnected ? (
                <>
                    <h3 className="text-white font-cyber text-sm">CREATE BURNER WALLET</h3>
                    <p className="text-[10px] text-gray-400 leading-tight">
                        Generate a secure, local-session wallet. Key never leaves this device. Powered by Dune Sim API.
                    </p>
                    <button 
                        onClick={handleCreateWallet}
                        className="w-full py-2 bg-cyan-900/40 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold rounded transition-colors"
                    >
                        GENERATE KEYPAIR
                    </button>
                </>
            ) : (
                <>
                    <div className="text-[10px] text-gray-500 font-mono break-all bg-gray-900 p-2 rounded border border-white/5">
                        {wallet.address}
                    </div>
                    <button 
                        onClick={disconnect}
                        className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-bold rounded transition-colors border border-red-900/50"
                    >
                        BURN IDENTITY
                    </button>
                </>
            )}
         </div>
      )}
    </div>
  );
};
