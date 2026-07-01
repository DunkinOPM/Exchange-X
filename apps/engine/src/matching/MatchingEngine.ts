import { EngineOrder } from "../models/EngineOrder";
import { MatchingResult } from "../models/MatchingResult";
import { OrderBook } from "../orderbook/OrderBook";

export class MatchingEngine {
  constructor(private readonly orderBook: OrderBook) {}

  submitOrder(order: EngineOrder): MatchingResult {
    return this.orderBook.addOrder(order);
  }
}