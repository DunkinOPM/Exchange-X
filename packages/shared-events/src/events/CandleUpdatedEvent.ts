export interface CandleUpdatedEvent {
  marketSymbol: string;
  candle: {
    marketSymbol: string;
    interval: "1m";
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
}