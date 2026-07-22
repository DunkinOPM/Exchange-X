import { create } from "zustand";

type OrderType = "LIMIT" | "MARKET";
type OrderSide = "BUY" | "SELL";

interface TradingStore {
  side: OrderSide;
  type: OrderType;

  setSide: (side: OrderSide) => void;
  setType: (type: OrderType) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  side: "BUY",
  type: "LIMIT",

  setSide: (side) => set({ side }),
  setType: (type) => set({ type }),
}));