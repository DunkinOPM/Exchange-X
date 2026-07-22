import { create } from "zustand";

interface Level {
  price: number;
  quantity: number;
}

interface OrderBookState {
  bids: Level[];
  asks: Level[];

  setBook: (book: {
    bids: Level[];
    asks: Level[];
  }) => void;
}

export const useOrderBookStore = create<OrderBookState>((set) => ({
  bids: [],
  asks: [],

  setBook: (book) =>
    set({
      bids: book.bids,
      asks: book.asks,
    }),
}));