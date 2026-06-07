import { OrderBook } from "./orderbook/OrderBook";
import { MatchingEngine } from "./matching/MatchingEngine";

const orderBook = new OrderBook();

const engine = new MatchingEngine(orderBook);

engine.submitOrder({
  id: "BUY1",
  userId: "user1",
  marketId: "BTCUSDT",
  side: "BUY",
  price: 100000,
  quantity: 2,
  filledQuantity: 0,
  status: "PENDING",
  createdAt: new Date(),
});

const trades = engine.submitOrder({
  id: "SELL1",
  userId: "user2",
  marketId: "BTCUSDT",
  side: "SELL",
  price: 100000,
  quantity: 1,
  filledQuantity: 0,
  status: "PENDING",
  createdAt: new Date(),
});

console.log("Trades:", trades);