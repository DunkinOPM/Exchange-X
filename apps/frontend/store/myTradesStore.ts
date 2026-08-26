import { create } from "zustand";
import {
  getMyTrades,
  TradeHistory,
} from "../services/trades";

interface MyTradesStore {
  trades: TradeHistory[];
  loading: boolean;
  error: string | null;

  loadTrades(): Promise<void>;
  clear(): void;
}

export const useMyTradesStore = create<MyTradesStore>((set) => ({
  trades: [],
  loading: false,
  error: null,

  loadTrades: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const trades = await getMyTrades();

      set({
        trades,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to load trade history",
      });
    }
  },

  clear: () =>
    set({
      trades: [],
      loading: false,
      error: null,
    }),
}));