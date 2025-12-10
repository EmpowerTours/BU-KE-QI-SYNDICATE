
export interface Message {
  id: string;
  text: string;
  methodOfHelp: string;
  timestamp: number;
  isOracleResponse?: boolean;
  walletAddress?: string;
  isChosen?: boolean;
  prophecy?: string;
  rewardAmount?: number;
  payoutTxHash?: string;
}

export enum OracleState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
}

export interface ChartData {
  title: string;
  type: 'bar' | 'line';
  data: { label: string; value: number }[];
  yAxisLabel?: string;
}

export interface OracleResponse {
  speech: string;
  visualization?: ChartData;
  sqlQuery?: string;
}

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
}
