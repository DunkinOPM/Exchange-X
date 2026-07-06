import { OrderBookSnapshot } from "@exchange/matching-engine";

export interface OrderBookUpdatedEvent {
  marketSymbol: string;
  snapshot: OrderBookSnapshot;
}