import { create } from "zustand";

interface Trade {
  price: number;
  quantity: number;
  executedAt: string;
}

interface TradeStore {
  trades: Trade[];

  addTrade: (trade: Trade) => void;
}

export const useTradesStore = create<TradeStore>((set) => ({
  trades: [],

  addTrade: (trade) =>
    set((state) => ({
      trades: [trade, ...state.trades].slice(0, 50),
    })),
}));