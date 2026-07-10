export interface Transaction {
  id: string;
  date: string;
  amount: number;
  concept: string;
  status: string;
}

export interface WalletBalance {
  currentBalance: number;
  currency: string;
}
