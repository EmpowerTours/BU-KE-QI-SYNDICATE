import React, { useState, useEffect } from 'react';
import { Message } from '../types';

interface MessageFeedProps {
  messages: Message[];
}

export const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Cycle through messages showing older ones continuously
  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      setTimeout(() => {
        // Switch to next older message (circular)
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        // Fade in
        setIsVisible(true);
      }, 500); // Wait for 500ms fade out transition
      
    }, 5000); // 5 seconds per message display

    return () => clearInterval(interval);
  }, [messages.length]);

  // When a new message arrives (array length changes), jump to the newest one (index 0)
  useEffect(() => {
    setCurrentIndex(0);
    setIsVisible(true);
  }, [messages.length]);

  const currentMessage = messages.length > 0 ? messages[currentIndex] : null;

  return (
    <div className="w-full max-w-md h-[260px] md:h-[300px] relative overflow-hidden glass-panel rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      
      {/* Title */}
      <h3 className="absolute top-4 font-cyber text-cyan-500/60 tracking-[0.2em] text-[10px] md:text-xs uppercase">
        Resonance Field
      </h3>

      {/* Decorative Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      {!currentMessage ? (
        <div className="text-gray-600 italic font-oracle animate-pulse text-sm">
          The void awaits your voice...
        </div>
      ) : (
        <div 
            className={`transition-all duration-500 ease-in-out transform flex flex-col items-center w-full
            ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        >
            {/* Wallet / Sender Badge */}
            <div className={`mb-4 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-mono tracking-wider shadow-lg
                ${currentMessage.isChosen 
                    ? 'border-yellow-500/50 text-yellow-400 bg-yellow-900/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                    : 'border-white/10 text-gray-400 bg-black/60'
                }`}
            >
                {currentMessage.walletAddress || 'ANON'} 
                {currentMessage.isChosen && <span className="ml-2 text-yellow-200 animate-pulse">★ CHOSEN</span>}
            </div>

            {/* Message Text */}
            <p className={`font-oracle text-lg md:text-xl leading-relaxed max-w-xs line-clamp-4
                ${currentMessage.isChosen 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]' 
                    : 'text-gray-200 drop-shadow-md'}
            `}>
                "{currentMessage.text}"
            </p>

            {/* Metadata Footer */}
            <div className="mt-5 flex flex-col items-center gap-1 w-full border-t border-white/5 pt-3">
                <span className={`text-[10px] uppercase tracking-widest font-bold
                    ${currentMessage.isChosen ? 'text-yellow-600' : 'text-cyan-700'}
                `}>
                    {currentMessage.methodOfHelp}
                </span>
                
                {/* Prophecy or Timestamp */}
                {currentMessage.isChosen && currentMessage.prophecy ? (
                    <span className="text-[9px] text-yellow-400/80 italic font-serif max-w-[80%]">
                        "{currentMessage.prophecy}"
                    </span>
                ) : (
                    <span className="text-[9px] text-gray-600 font-mono">
                       {new Date(currentMessage.timestamp).toLocaleTimeString()}
                    </span>
                )}
                
                {/* Blockchain Info */}
                {currentMessage.payoutTxHash && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-purple-400 font-mono">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        CONFIRMED TX: {currentMessage.payoutTxHash.substring(0,6)}...
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-cyan-500/30"></div>
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-cyan-500/30"></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-cyan-500/30"></div>
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-cyan-500/30"></div>
    </div>
  );
};