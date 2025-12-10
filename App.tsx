
import React, { useState, useEffect } from 'react';
import { CrystalBall } from './components/CrystalBall';
import { MessageFeed } from './components/MessageFeed';
import { NativeWallet } from './components/NativeWallet';
import { DashboardSimulation } from './components/DashboardSimulation';
import { CodeTerminal } from './components/CodeTerminal';
import { Message, OracleState, WalletState, OracleResponse } from './types';
import { getOracleWisdom, selectChosenOne } from './services/geminiService';

const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = 'bukeqi_oracle_messages';

// Simulation Constants
const TRIBUTE_COST = 10; // MON

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    return [
      { id: '1', text: "Show me the MON transaction volume for today.", methodOfHelp: "Oracle Consultation", timestamp: Date.now() - 100000, walletAddress: "0x32...88A" },
      { id: '2', text: "I need funds to launch my dApp.", methodOfHelp: "Monetary Aid", timestamp: Date.now() - 500000, walletAddress: "0xBB...11C" },
    ];
  });
  
  const [wallet, setWallet] = useState<WalletState>({ 
    isConnected: false, 
    address: null, 
    balance: '0.00', 
    isLoading: false 
  });

  const [input, setInput] = useState('');
  const [oracleState, setOracleState] = useState<OracleState>(OracleState.IDLE);
  const [oracleResponse, setOracleResponse] = useState<OracleResponse>({ speech: "The Syndicate awaits your tribute." });

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!wallet.isConnected || !wallet.address) {
        alert("Initialize your burner identity first.");
        return;
    }
    // Simple mock check - in real app we would check balance properly
    if (parseFloat(wallet.balance) < TRIBUTE_COST && parseFloat(wallet.balance) !== 0) { 
        // We allow 0 for demo purposes if sim api fails, otherwise enforcing cost
        // alert("Insufficient MON tribute."); 
        // return;
    }

    setOracleState(OracleState.PROCESSING);
    setOracleResponse({ speech: "Processing tribute... Accessing Dune Sim Layer..." });

    const newMessage: Message = {
      id: generateId(),
      text: input,
      methodOfHelp: "Oracle Consultation", // Auto-default
      timestamp: Date.now(),
      walletAddress: wallet.address
    };

    setMessages(prev => [newMessage, ...prev]);
    setInput('');

    // Call Gemini
    const result = await getOracleWisdom(newMessage.text, newMessage.methodOfHelp);
    
    setOracleState(OracleState.SPEAKING);
    setOracleResponse(result);

    const readTime = Math.max(8000, result.speech.length * 50);

    setTimeout(() => {
        setOracleState(OracleState.IDLE);
        // Don't clear dashboard immediately if there is one, let it linger
        if (!result.visualization && !result.sqlQuery) {
            setOracleResponse({ speech: "The Syndicate awaits your tribute." });
        }
    }, readTime);
  };

  const handleClosingRitual = async () => {
    if (messages.length === 0) return;
    
    const confirmRitual = window.confirm("Initiate the Closing Ritual? The Oracle will judge all souls.");
    if (!confirmRitual) return;

    setOracleState(OracleState.PROCESSING);
    setOracleResponse({ speech: "Commencing final judgment of the cycle..." });

    await new Promise(r => setTimeout(r, 2000));

    const result = await selectChosenOne(messages);
    
    if (result.chosenId) {
      setMessages(prev => prev.map(msg => 
        msg.id === result.chosenId 
          ? { ...msg, isChosen: true, prophecy: result.prophecy, payoutTxHash: "0x" + Math.random().toString(16).substr(2, 40) }
          : { ...msg, isChosen: false }
      ));
      
      setOracleState(OracleState.SPEAKING);
      setOracleResponse({ speech: `THE CHOSEN ONE FOUND. ${result.prophecy}` });
    } else {
      setOracleState(OracleState.IDLE);
      setOracleResponse({ speech: "The stars are silent. No one was chosen today." });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative selection:bg-cyan-500 selection:text-black font-sans">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{
             backgroundImage: 'linear-gradient(rgba(20, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 255, 255, 0.03) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
           }}>
      </div>

      <NativeWallet onWalletChange={setWallet} />

      <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-6 md:py-20">
        
        {/* Header */}
        <header className="text-center mb-8 md:mb-12 mt-12 md:mt-0">
            <h1 className="text-3xl md:text-6xl font-cyber font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-cyan-200 to-gray-400">
                BU KE QI SYNDICATE
            </h1>
            <p className="text-cyan-500/60 font-mono tracking-[0.5em] text-xs md:text-sm mt-2">YOU ARE WELCOME</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full max-w-7xl items-start">
            
            {/* Left: Input Form */}
            <div className="lg:col-span-1 order-2 lg:order-1 flex flex-col justify-center w-full sticky top-20">
                <div className="glass-panel p-5 md:p-6 rounded-2xl relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-black rounded-xl p-4">
                        <h2 className="text-lg md:text-xl font-oracle mb-6 text-gray-200 border-b border-gray-800 pb-2">Consult The Oracle</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1">YOUR REQUEST (DATA, SQL, FATE)</label>
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-oracle h-24 resize-none"
                                    placeholder="e.g., 'Show me MON flows from Coinbase', 'Write a Dune Query for NFT volume'..."
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={!wallet.isConnected || oracleState !== OracleState.IDLE}
                                className={`w-full py-3 md:py-4 rounded-lg font-cyber font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group text-sm md:text-base
                                    ${!wallet.isConnected ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                                      oracleState !== OracleState.IDLE ? 'bg-purple-900/50 text-purple-300 cursor-wait' :
                                      'bg-white text-black hover:bg-cyan-50 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {oracleState === OracleState.IDLE ? `TRANSMIT REQUEST` : 'COMMUNICATING...'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Center: The Oracle & Dashboard */}
            <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col items-center justify-start w-full min-h-[500px]">
                <CrystalBall state={oracleState} />
                
                <div className="mt-6 text-center w-full max-w-xl px-4 flex flex-col items-center">
                    <p className={`font-oracle text-base md:text-lg transition-all duration-1000 leading-tight whitespace-pre-line
                        ${oracleState === OracleState.SPEAKING ? 'text-yellow-100 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-cyan-100/80 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'}`}>
                        "{oracleResponse.speech}"
                    </p>

                    {/* Render Chart if present */}
                    {oracleResponse.visualization && (
                        <DashboardSimulation data={oracleResponse.visualization} />
                    )}

                    {/* Render SQL Code Terminal if present */}
                    {oracleResponse.sqlQuery && (
                        <CodeTerminal code={oracleResponse.sqlQuery} />
                    )}
                </div>
            </div>

            {/* Right: Message Stream */}
            <div className="lg:col-span-1 order-3 lg:order-3 w-full flex justify-center sticky top-20">
                <MessageFeed messages={messages} />
            </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative w-full flex flex-col items-center justify-center text-gray-700 text-[10px] md:text-xs font-mono pb-8 gap-4">
        <div>BU KE QI SYNDICATE © 2077 // POWERED BY MONAD & DUNE SIM API</div>
        {wallet.isConnected && (
            <button 
                onClick={handleClosingRitual}
                className="text-gray-800 hover:text-red-500 transition-colors uppercase tracking-widest text-[9px] border border-gray-800 hover:border-red-900 px-3 py-1 rounded"
            >
                [ Simulate End of Day Ritual ]
            </button>
        )}
      </footer>
    </div>
  );
};

export default App;
