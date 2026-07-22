import { api } from "./api";

export async function placeOrder(data: {
  userId: string;
  market: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  price?: number;
  quantity: number;
}) {
  const response = await api.post("/orders", data);

  return response.data;
}

export async function cancelOrder(id: string) {
  return api.delete(`/orders/${id}`);
}

export async function getOpenOrders(
  userId: string,
  market?: string
) {
  const params = new URLSearchParams();

  if (market) {
    params.append("market", market);
  }

  const response = await fetch(
    `http://localhost:4000/orders/open/${userId}?${params.toString()}`
  );

  return response.json();
}