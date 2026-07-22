export interface Candle {
  marketSymbol: string;
  interval: "1m";
  openTime: number;

  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;
}

export class CandleService {
  private candles = new Map<string, Candle>();

  private getBucket(timestamp: number): number {
    // Start of the current minute
    return Math.floor(timestamp / 60000) * 60000;
  }

  private getKey(market: string, bucket: number): string {
    return `${market}:${bucket}`;
  }

  processTrade(
    marketSymbol: string,
    price: number,
    quantity: number,
    executedAt: Date
  ): Candle {
    const timestamp = executedAt.getTime();

    const bucket = this.getBucket(timestamp);

    const key = this.getKey(marketSymbol, bucket);

    const existing = this.candles.get(key);

    if (!existing) {
      const candle: Candle = {
        marketSymbol,
        interval: "1m",
        openTime: bucket,

        open: price,
        high: price,
        low: price,
        close: price,

        volume: quantity,
      };

      this.candles.set(key, candle);

      return candle;
    }

    existing.high = Math.max(existing.high, price);
    existing.low = Math.min(existing.low, price);
    existing.close = price;
    existing.volume += quantity;

    return existing;
  }

  getCurrentCandle(marketSymbol: string): Candle | null {
    const prefix = `${marketSymbol}:`;

    const candles = [...this.candles.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .sort((a, b) => b[1].openTime - a[1].openTime);

    if (!candles.length) return null;

    return candles[0][1];
  }

  getCandles(marketSymbol: string): Candle[] {
    const prefix = `${marketSymbol}:`;

    return [...this.candles.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .sort((a, b) => a[1].openTime - b[1].openTime)
      .map(([, candle]) => candle);
  }
}

export const candleService = new CandleService();