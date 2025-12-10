import React from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
  balance?: number;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ isConnected, onConnect, walletAddress, balance }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      {!isConnected ? (
        <button 
          onClick={onConnect}
          className="bg-white text-black font-cyber font-bold px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          CONNECT WALLET
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
          <div className="flex flex-col items-end">
            <span className="font-mono text-xs text-gray-400">{walletAddress}</span>
            <span className="font-cyber text-cyan-400 text-sm font-bold">{balance} MON</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full border border-white/20"></div>
        </div>
      )}
    </div>
  );
};
