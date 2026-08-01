import { create } from "zustand";
import { getOpenOrders } from "../services/orders";

export interface OpenOrder {
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
  orders: OpenOrder[];
  loading: boolean;
  error: string | null;

  loadOrders: (
    userId: string,
    market?: string
  ) => Promise<void>;

  clear: () => void;
}

export const useOpenOrdersStore = create<Store>((set) => ({
  orders: [],
  loading: false,
  error: null,

  loadOrders: async (userId, market) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const orders = await getOpenOrders(userId, market);

      set({
        orders,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to load orders",
      });
    }
  },

  clear: () =>
    set({
      orders: [],
      loading: false,
      error: null,
    }),
}));