import { create } from "zustand";

interface Ticker {
  bestBid: number | null;
  bestAsk: number | null;
  lastPrice: number | null;
  spread: number | null;
}

interface TickerStore {
  ticker: Ticker;

  setTicker: (ticker: Ticker) => void;
}

export const useTickerStore = create<TickerStore>((set) => ({
  ticker: {
    bestBid: null,
    bestAsk: null,
    lastPrice: null,
    spread: null,
  },

  setTicker: (ticker) =>
    set({
      ticker,
    }),
}));