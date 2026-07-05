export interface TickerUpdatedEvent {
  marketSymbol: string;

  lastPrice: number;

  volume: number;
}