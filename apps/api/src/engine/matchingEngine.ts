import { MatchingEngine } from "../../../engine/src/matching/MatchingEngine";
import { OrderBook } from "../../../engine/src/orderbook/OrderBook";

export const matchingEngine = new MatchingEngine(
  new OrderBook()
);