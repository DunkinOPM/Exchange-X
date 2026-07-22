import { create } from "zustand";

export interface Candle {
  marketSymbol: string;
  interval: "1m";

  openTime: number;

  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;
}

interface CandleState {
  candles: Candle[];

  setCandles: (candles: Candle[]) => void;

  updateCandle: (candle: Candle) => void;

  clear: () => void;
}

export const useCandleStore = create<CandleState>((set) => ({
  candles: [],

  setCandles: (candles) =>
    set({
      candles,
    }),

  updateCandle: (candle) =>
    set((state) => {
      const index = state.candles.findIndex(
        (c) =>
          c.marketSymbol === candle.marketSymbol &&
          c.openTime === candle.openTime,
      );

      if (index === -1) {
        return {
          candles: [...state.candles, candle],
        };
      }

      const candles = [...state.candles];

      candles[index] = candle;

      return {
        candles,
      };
    }),

  clear: () =>
    set({
      candles: [],
    }),
}));