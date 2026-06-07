import { OrderBook } from "../orderbook/OrderBook";
import { MatchingEngine } from "../matching/MatchingEngine";

function createEngine() {
  const orderBook = new OrderBook();
  return {
    engine: new MatchingEngine(orderBook),
    orderBook,
  };
}

console.log("\n==============================");
console.log("TEST 1 - FULL MATCH");
console.log("==============================");

{
  const { engine, orderBook } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketId: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
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
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Bids:", orderBook.getBids());
  console.log("Asks:", orderBook.getAsks());
}

console.log("\n==============================");
console.log("TEST 2 - PARTIAL FILL");
console.log("==============================");

{
  const { engine, orderBook } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketId: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 5,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketId: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 2,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Remaining Bids:", orderBook.getBids());
  console.log("Remaining Asks:", orderBook.getAsks());
}

console.log("\n==============================");
console.log("TEST 3 - FIFO");
console.log("==============================");

{
  const { engine, orderBook } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketId: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  engine.submitOrder({
    id: "BUY2",
    userId: "user2",
    marketId: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user3",
    marketId: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Remaining Bids:", orderBook.getBids());
}

console.log("\n==============================");
console.log("TEST 4 - NO MATCH");
console.log("==============================");

{
  const { engine, orderBook } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketId: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketId: "BTCUSDT",
    side: "SELL",
    price: 101000,
    quantity: 1,
    filledQuantity: 0,
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Bids:", orderBook.getBids());
  console.log("Asks:", orderBook.getAsks());
}