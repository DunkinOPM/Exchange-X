export interface OrderMatchedEvent {
  buyOrderId: string;

  sellOrderId: string;

  marketSymbol: string;

  price: number;

  quantity: number;

  executedAt: Date;
}