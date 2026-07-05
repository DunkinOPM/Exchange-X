export interface OrderPlacedEvent {
  orderId: string;

  marketSymbol: string;

  side: "BUY" | "SELL";

  price: number;

  quantity: number;
}