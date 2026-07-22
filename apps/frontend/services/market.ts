import { api } from "./api";

export async function fetchOrderBook(
  market: string
) {
  const response = await api.get(
    `/markets/${market}/orderbook`
  );

  return response.data;
}