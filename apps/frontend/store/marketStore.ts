import { create } from "zustand";

interface MarketStore {
  selectedMarket: string;
  setMarket: (market: string) => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
  selectedMarket: "BTCUSDT",

  setMarket: (market) =>
    set({
      selectedMarket: market,
    }),
}));