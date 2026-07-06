import { EngineOrder } from "../models/EngineOrder";
import { MatchingResult } from "../models/MatchingResult";
import { OrderBook } from "../orderbook/OrderBook";

export class MatchingEngine {
  private readonly orderBooks = new Map<string, OrderBook>();

  public getOrderBook(marketId: string): OrderBook {
    let orderBook = this.orderBooks.get(marketId);

    if (!orderBook) {
      orderBook = new OrderBook();
      this.orderBooks.set(marketId, orderBook);
    }

    return orderBook;
  }

  submitOrder(order: EngineOrder): MatchingResult {
    return this.getOrderBook(order.marketSymbol).addOrder(order);
  }

  cancelOrder(marketId: string, orderId: string): EngineOrder | null {
    return this.getOrderBook(marketId).cancelOrder(orderId);
  }

  getOrderBookSnapshot(marketSymbol: string) {
  return this.getOrderBook(marketSymbol).getSnapshot();
}

  getTicker(marketId: string) {
    return this.getOrderBook(marketId).getTicker();
  }
}
