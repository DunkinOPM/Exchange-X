import { api } from "./api";

export interface TradeHistory {
  id: string;
  market: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  total: number;
  executedAt: string;
}

export async function getMyTrades(
  userId: string,
): Promise<TradeHistory[]> {
  const { data } = await api.get<TradeHistory[]>("/trades/me", {
    params: {
      userId,
    },  
  });

  return data;
}