import { api } from "./api";

export interface Balance {
  id: string;
  userId: string;
  asset: string;
  available: number;
  locked: number;
}

export async function getPortfolio(
  userId: string,
): Promise<Balance[]> {
  const { data } = await api.get<Balance[]>(
    `/wallet/${userId}`,
  );

  return data.map((balance) => ({
    ...balance,
    available: Number(balance.available),
    locked: Number(balance.locked),
  }));
}