export interface TickerUpdatedEvent {
  marketSymbol: string;

  ticker: {
    bestBid: number | null;
    bestAsk: number | null;
    lastPrice: number | null;
    spread: number | null;
  };
}