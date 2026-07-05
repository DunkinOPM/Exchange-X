export type OrderSide = "BUY" | "SELL";

export type OrderStatus =
  | "PENDING"
  | "PARTIALLY_FILLED"
  | "FILLED";

export interface EngineOrder {
  id: string;

  userId: string;

  marketSymbol: string;

  side: OrderSide;

  price: number;

  quantity: number;

  filledQuantity: number;

  status: OrderStatus;

  createdAt: Date;
}