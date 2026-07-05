export interface Ticker {
  bestBid: number | null;
  bestAsk: number | null;

  lastPrice: number | null;

  spread: number | null;
}