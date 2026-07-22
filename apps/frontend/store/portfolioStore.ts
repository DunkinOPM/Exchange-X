import { create } from "zustand";

interface Balance {
  asset: string;
  available: string;
  locked: string;
}

interface PortfolioStore {
  balances: Balance[];
  setBalances: (balances: Balance[]) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  balances: [],
  setBalances: (balances) => set({ balances }),
}));