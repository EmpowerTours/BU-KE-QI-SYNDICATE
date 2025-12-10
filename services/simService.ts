
import { WalletState } from "../types";

const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';
const CHAIN_ID = 10143; 

// Helper to generate a random EVM-like address
const generateRandomAddress = () => {
  const chars = '0123456789ABCDEF';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * 16)];
  }
  return addr;
};

export const createWallet = (): WalletState => {
  // Check if we already have a wallet in storage
  const savedAddress = localStorage.getItem('bukeqi_wallet_address');
  
  if (savedAddress) {
    return {
      address: savedAddress,
      balance: '0.00',
      isConnected: true,
      isLoading: false
    };
  }

  // Create new identity
  const newAddress = generateRandomAddress();
  localStorage.setItem('bukeqi_wallet_address', newAddress);

  return {
    address: newAddress,
    balance: '0.00', // Initial balance
    isConnected: true,
    isLoading: false
  };
};

export const fetchWalletBalance = async (address: string): Promise<string> => {
  if (!address) return '0.00';

  // REAL DATA: Query the Monad Testnet RPC directly
  try {
    const response = await fetch(MONAD_TESTNET_RPC, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [address, "latest"],
            id: 1
        })
    });

    if (!response.ok) {
        throw new Error(`RPC Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result) {
        // Convert Hex Wei to Decimal MON
        const wei = BigInt(data.result);
        const mon = Number(wei) / 1e18;
        return mon.toFixed(4);
    }
    
    return '0.00';

  } catch (error) {
    console.warn("RPC Connection Failed:", error);
    return '0.00'; 
  }
};
