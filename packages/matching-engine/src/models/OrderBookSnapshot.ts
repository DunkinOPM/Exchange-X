import { OrderBookLevel } from "./OrderBookLevel";

export interface OrderBookSnapshot {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}