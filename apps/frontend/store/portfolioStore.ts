import { create } from "zustand";
import {
  Balance,
  getPortfolio,
} from "../services/portfolio";

interface PortfolioStore {
  balances: Balance[];
  loading: boolean;
  error: string | null;

  loadPortfolio(userId: string): Promise<void>;
}

export const usePortfolioStore =
  create<PortfolioStore>((set) => ({
    balances: [],
    loading: false,
    error: null,

    loadPortfolio: async (userId) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const balances = await getPortfolio(userId);

        set({
          balances,
          loading: false,
        });
      } catch (err) {
        set({
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load portfolio",
        });
      }
    },
  }));