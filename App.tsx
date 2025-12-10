import React, { useState, useEffect, useRef } from 'react';
import { CrystalBall } from './components/CrystalBall';
import { MessageFeed } from './components/MessageFeed';
import { WalletConnect } from './components/WalletConnect';
import { Message, OracleState } from './types';
import { getOracleWisdom, generateRandomVision } from './services/geminiService';

// Since we can't use uuid package without adding to package.json which I can't control fully here, helper fn:
const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_WALLET = "0x7A...9F2B";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "I wish for guidance in my startup journey.", methodOfHelp: "Mentorship", timestamp: Date.now() - 100000, walletAddress: "0x32...88A" },
    { id: '2', text: "Lost my keys, need luck finding them.", methodOfHelp: "Luck", timestamp: Date.now() - 500000, walletAddress: "0xBB...11C" },
    { id: '3', text: "Seeking the next big alpha.", methodOfHelp: "Knowledge", timestamp: Date.now() - 800000, walletAddress: "ANON" },
  ]);
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(100); // 100 MON mock
  const [input, setInput] = useState('');
  const [helpMethod, setHelpMethod] = useState('');
  const [oracleState, setOracleState] = useState<OracleState>(OracleState.IDLE);
  const [oracleMessage, setOracleMessage] = useState<string>("The Syndicate awaits your tribute.");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Background ambient visions
  useEffect(() => {
    const interval = setInterval(async () => {
        if (oracleState === OracleState.IDLE && Math.random() > 0.7) {
            // Occasionally show a random vision text if idle
            // const vision = await generateRandomVision();
            // setOracleMessage(vision);
        }
    }, 10000);
    return () => clearInterval(interval);
  }, [oracleState]);

  const handleConnect = () => {
    setWalletConnected(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !helpMethod.trim()) return;
    if (!walletConnected) {
        alert("Connect your soul (wallet) first.");
        return;
    }
    if (balance < 10) {
        alert("Insufficient MON tribute.");
        return;
    }

    // Payment Animation logic
    setBalance(prev => prev - 10);
    setOracleState(OracleState.PROCESSING);
    setOracleMessage("Processing tribute... deciphering intent...");

    const newMessage: Message = {
      id: generateId(),
      text: input,
      methodOfHelp: helpMethod,
      timestamp: Date.now(),
      walletAddress: MOCK_WALLET
    };

    // Add to feed immediately
    setMessages(prev => [newMessage, ...prev]);
    setInput('');
    setHelpMethod('');

    // Call Gemini
    const wisdom = await getOracleWisdom(newMessage.text, newMessage.methodOfHelp);
    
    setOracleState(OracleState.SPEAKING);
    setOracleMessage(wisdom);

    // Reset state after speaking
    setTimeout(() => {
        setOracleState(OracleState.IDLE);
        setOracleMessage("The Syndicate watches. One will be chosen at day's end.");
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative selection:bg-cyan-500 selection:text-black">
      
      {/* Background Grid/Effect */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{
             backgroundImage: 'linear-gradient(rgba(20, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 255, 255, 0.03) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
           }}>
      </div>

      <WalletConnect 
        isConnected={walletConnected} 
        onConnect={handleConnect} 
        walletAddress={MOCK_WALLET}
        balance={balance}
      />

      <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-6 md:py-20">
        
        {/* Header */}
        <header className="text-center mb-6 md:mb-10 space-y-2 mt-10 md:mt-0">
            <h1 className="text-3xl md:text-6xl font-cyber font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-cyan-200 to-gray-400">
                BU KE QI SYNDICATE
            </h1>
            <p className="text-cyan-500/60 font-mono tracking-[0.5em] text-xs md:text-sm">YOU ARE WELCOME</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full max-w-6xl items-center">
            
            {/* Left: Input Form - Order 2 on Mobile (Below Oracle) */}
            <div className="lg:col-span-1 order-2 lg:order-1 flex flex-col justify-center w-full">
                <div className="glass-panel p-5 md:p-6 rounded-2xl relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-black rounded-xl p-4">
                        <h2 className="text-lg md:text-xl font-oracle mb-6 text-gray-200 border-b border-gray-800 pb-2">Consult The Oracle</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1">YOUR MESSAGE (ANONYMOUS)</label>
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-oracle h-20 md:h-24 resize-none"
                                    placeholder="Speak your truth..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1">HOW SHALL WE HELP?</label>
                                <select 
                                    value={helpMethod}
                                    onChange={(e) => setHelpMethod(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none transition-all font-sans text-gray-300"
                                >
                                    <option value="" disabled>Select intervention method...</option>
                                    <option value="Monetary Aid">Monetary Aid</option>
                                    <option value="Strategic Advice">Strategic Advice</option>
                                    <option value="Karmic Justice">Karmic Justice</option>
                                    <option value="Digital Blessing">Digital Blessing</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={!walletConnected || oracleState !== OracleState.IDLE}
                                className={`w-full py-3 md:py-4 rounded-lg font-cyber font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group text-sm md:text-base
                                    ${!walletConnected ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                                      oracleState !== OracleState.IDLE ? 'bg-purple-900/50 text-purple-300 cursor-wait' :
                                      'bg-white text-black hover:bg-cyan-50 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {oracleState === OracleState.IDLE ? 'PAY 10 MON & SUBMIT' : 'TRANSMITTING...'}
                                </span>
                            </button>
                            <p className="text-[10px] text-center text-gray-600 mt-2 font-mono">
                                *One request chosen daily.
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Center: The Oracle - Order 1 on Mobile (Top) */}
            <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col items-center justify-center w-full">
                <CrystalBall state={oracleState} />
                
                <div className="mt-4 md:mt-8 text-center min-h-[60px] md:min-h-[80px] w-full max-w-sm px-4">
                    <p className={`font-oracle text-base md:text-xl transition-all duration-1000 leading-tight
                        ${oracleState === OracleState.SPEAKING ? 'text-yellow-100 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-cyan-100/80 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'}`}>
                        "{oracleMessage}"
                    </p>
                </div>
            </div>

            {/* Right: Message Stream - Order 3 on Mobile (Bottom) */}
            <div className="lg:col-span-1 order-3 lg:order-3 w-full flex justify-center">
                <MessageFeed messages={messages} />
            </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative bottom-4 w-full text-center text-gray-700 text-[10px] md:text-xs font-mono mt-8 md:mt-0 pb-4 md:pb-0">
        BU KE QI SYNDICATE © 2077 // DECENTRALIZED BENEVOLENCE PROTOCOL
      </footer>
    </div>
  );
};

export default App;