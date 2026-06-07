export interface Trade {
  buyOrderId: string;
  sellOrderId: string;

  price: number;
  quantity: number;

  executedAt: Date;
}