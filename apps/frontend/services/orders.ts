import { api } from "./api";

export async function placeOrder(data: {
  market: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  price?: number;
  quantity: number;
}) {
  const { data: response } = await api.post(
    "/orders",
    data,
  );

  return response;
}

export async function cancelOrder(id: string) {
  const { data } = await api.post(
    `/orders/${id}/cancel`,
  );

  return data;
}

export async function getOpenOrders(
  market?: string,
) {
  const { data } = await api.get(
    "/orders/open",
    {
      params: {
        market,
      },
    },
  );

  return data;
}