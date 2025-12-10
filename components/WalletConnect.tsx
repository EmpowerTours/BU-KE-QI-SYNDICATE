import React from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
  balance?: number;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ isConnected, onConnect, walletAddress, balance }) => {
  return (
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex flex-col items-end gap-2">
      {!isConnected ? (
        <button 
          onClick={onConnect}
          className="bg-white text-black font-cyber font-bold px-4 py-2 md:px-6 md:py-2 text-xs md:text-base rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
        >
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
          CONNECT <span className="hidden md:inline">WALLET</span>
        </button>
      ) : (
        <>
            <div className="flex items-center gap-2 md:gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg">
            <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] md:text-xs text-gray-400">{walletAddress}</span>
                <span className="font-cyber text-cyan-400 text-xs md:text-sm font-bold">{balance} MON</span>
            </div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full border border-white/20"></div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-900/40 rounded-md border border-purple-500/20 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[9px] md:text-[10px] font-mono text-purple-200">MONAD TESTNET (10143)</span>
            </div>
        </>
      )}
    </div>
  );
};