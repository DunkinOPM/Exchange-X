import { MatchingEngine } from "../matching/MatchingEngine";

function createEngine() {
  const engine = new MatchingEngine();

  return {
    engine,
  };
}

console.log("\n==============================");
console.log("TEST 1 - FULL MATCH");
console.log("==============================");

{
  const { engine } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketSymbol: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Bids:", engine.getOrderBook("BTCUSDT").getBids());
  console.log("Asks:", engine.getOrderBook("BTCUSDT").getAsks());
}

console.log("\n==============================");
console.log("TEST 2 - PARTIAL FILL");
console.log("==============================");

{
  const { engine } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 5,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketSymbol: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 2,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Remaining Bids:", engine.getOrderBook("BTCUSDT").getBids());
  console.log("Remaining Asks:", engine.getOrderBook("BTCUSDT").getAsks());
  console.log(engine.getOrderBook("BTCUSDT").getBids().get(100000)?.[0]);
}

console.log("\n==============================");
console.log("TEST 3 - FIFO");
console.log("==============================");

{
  const { engine } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  engine.submitOrder({
    id: "BUY2",
    userId: "user2",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user3",
    marketSymbol: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Remaining Bids:", engine.getOrderBook("BTCUSDT").getBids());
}

console.log("\n==============================");
console.log("TEST 4 - NO MATCH");
console.log("==============================");

{
  const { engine } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  const trades = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketSymbol: "BTCUSDT",
    side: "SELL",
    price: 101000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  console.log("Trades:", trades);
  console.log("Bids:", engine.getOrderBook("BTCUSDT").getBids());
  console.log("Asks:", engine.getOrderBook("BTCUSDT").getAsks());
}

console.log("\n==============================");
console.log("TEST 5 - FILLED STATUS");
console.log("==============================");

{
  const { engine } = createEngine();

  engine.submitOrder({
    id: "BUY1",
    userId: "user1",
    marketSymbol: "BTCUSDT",
    side: "BUY",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  const result = engine.submitOrder({
    id: "SELL1",
    userId: "user2",
    marketSymbol: "BTCUSDT",
    side: "SELL",
    price: 100000,
    quantity: 1,
    filledQuantity: 0,
    status: "PENDING",
    createdAt: new Date(),
  });

  console.log(result);
}