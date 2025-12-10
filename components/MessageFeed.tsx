import React from 'react';
import { Message } from '../types';

interface MessageFeedProps {
  messages: Message[];
}

export const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <div className="w-full max-w-md h-[320px] md:h-[400px] relative overflow-hidden glass-panel rounded-xl p-4 flex flex-col">
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
      
      <h3 className="text-center font-cyber text-cyan-400 tracking-widest text-xs uppercase mb-4 opacity-70">
        Resonance Field (Recent Requests)
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-20 custom-scrollbar relative">
        {messages.length === 0 && (
            <div className="text-center text-gray-600 mt-20 italic font-oracle">The void listens...</div>
        )}
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`relative p-3 rounded transition-all duration-500 animate-[float_6s_ease-in-out_infinite] group
                ${msg.isChosen 
                    ? 'border border-yellow-500/50 bg-yellow-900/20 shadow-[0_0_20px_rgba(255,215,0,0.2)] z-10' 
                    : 'border border-white/5 bg-black/40 hover:border-cyan-500/30'
                }`}
          >
             <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-mono ${msg.isChosen ? 'text-yellow-400 font-bold' : 'text-gray-500'}`}>
                    {msg.walletAddress || 'ANON'} {msg.isChosen && '★ CHOSEN ONE'}
                </span>
                <span className="text-[10px] text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
             </div>
             <p className={`${msg.isChosen ? 'text-yellow-100' : 'text-gray-300'} font-light text-sm leading-relaxed font-oracle`}>
                "{msg.text}"
             </p>
             <div className="mt-2 text-[10px] uppercase tracking-wide border-t border-white/5 pt-1 flex justify-between">
                <span className={msg.isChosen ? 'text-yellow-500' : 'text-cyan-700'}>
                    Wish: {msg.methodOfHelp}
                </span>
             </div>

             {/* Oracle Prophecy Display if Chosen */}
             {msg.isChosen && msg.prophecy && (
                <div className="mt-2 pt-2 border-t border-yellow-500/20 text-[10px] text-yellow-300/80 italic font-serif">
                    Oracle: "{msg.prophecy}"
                </div>
             )}
             
             {/* Decorative Corner */}
             <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-opacity 
                ${msg.isChosen ? 'border-yellow-500 opacity-100' : 'border-cyan-500/50 opacity-0 group-hover:opacity-100'}`}>
             </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};