import { api } from "./api";

export async function fetchPortfolio(userId: string) {
  const response = await api.get(`/wallet/${userId}`);

  return response.data;
}