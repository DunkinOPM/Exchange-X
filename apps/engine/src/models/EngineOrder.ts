export type OrderSide = "BUY" | "SELL";

export interface EngineOrder {
  id: string;

  userId: string;

  marketId: string;

  side: OrderSide;

  price: number;

  quantity: number;

  filledQuantity: number;

  createdAt: Date;
}