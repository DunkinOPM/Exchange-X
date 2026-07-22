import dotenv from "dotenv";
import { registerEventListeners } from "./events/registerEventListeners";
import { recoverMatchingEngine } from "./lib/recoverEngine";
import { walletRoutes } from "./routes/wallet";
import Fastify from "fastify";
import { orderRoutes } from "./routes/orders";
import { marketRoutes } from "./routes/markets";
import cors from "@fastify/cors";
import { candleRoutes } from "./routes/candles";
import { tradeRoutes } from "./routes/trades";
dotenv.config({
  path: "../../.env",
});
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

const start = async () => {
  try {
    await app.register(cors, {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    });

    app.register(orderRoutes);
    app.register(walletRoutes);
    app.register(marketRoutes);
    app.register(candleRoutes);
    app.register(tradeRoutes, {
      prefix: "/trades",
    });
    await recoverMatchingEngine();

    registerEventListeners();

    await app.listen({
      port: 4000,
      host: "0.0.0.0",
    });

    console.log("API running on port 4000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
