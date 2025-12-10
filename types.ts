export interface Message {
  id: string;
  text: string;
  methodOfHelp: string; // The "way they wish to be helped"
  timestamp: number;
  isOracleResponse?: boolean;
  walletAddress?: string; // Masked address
  isChosen?: boolean; // If this message was selected by the Oracle
  prophecy?: string; // The Oracle's reason for choosing this
}

export enum OracleState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
}

export interface OracleResponse {
  text: string;
}