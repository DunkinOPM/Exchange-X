import { Ticker } from "@exchange/matching-engine";

export interface TickerUpdatedEvent {
  marketSymbol: string;
  ticker: Ticker;
}