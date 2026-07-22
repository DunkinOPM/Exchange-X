import { create } from "zustand";

interface Order {
  id: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  status: string;
  market: {
    symbol: string;
  };
}

interface Store {
  orders: Order[];

  setOrders: (orders: Order[]) => void;
}

export const useOpenOrdersStore = create<Store>((set) => ({
  orders: [],

  setOrders: (orders) =>
    set({
      orders,
    }),
}));