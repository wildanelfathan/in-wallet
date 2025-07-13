export type CryptoNetwork = 'ethereum' | 'polygon' | 'bsc';

export type CryptoToken = {
  symbol: string;
  name: string;
  decimals: number;
  address: string | null; // null for native tokens like ETH
  network: CryptoNetwork;
};

export type CryptoWallet = {
  id: string;
  address: string;
  network: CryptoNetwork;
  balance: string;
  userId: string;
};

export type CryptoTransferParams = {
  userId: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  token: CryptoToken;
  network: CryptoNetwork;
};

export type CryptoTransferResult = {
  success: boolean;
  message?: string;
  error?: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
}; 