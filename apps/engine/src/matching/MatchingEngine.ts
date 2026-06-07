import { EngineOrder } from "../models/EngineOrder";
import { OrderBook } from "../orderbook/OrderBook";
import { Trade } from "../models/Trade";

export class MatchingEngine {
  constructor(private readonly orderBook: OrderBook) {}

  submitOrder(order: EngineOrder): Trade[] {
    return this.orderBook.addOrder(order);
  }
}