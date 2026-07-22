const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getCandles(market: string) {
  const response = await fetch(`${API_URL}/candles/${market}`);

  if (!response.ok) {
    throw new Error("Failed to fetch candles");
  }

  return response.json();
}