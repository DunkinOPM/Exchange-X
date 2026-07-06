import dotenv from "dotenv";
import { registerEventListeners } from "./events/registerEventListeners";
import { recoverMatchingEngine } from "./lib/recoverEngine";
import { walletRoutes } from "./routes/wallet";
import Fastify from "fastify";
import { orderRoutes } from "./routes/orders";
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
    app.register(walletRoutes);
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
app.register(orderRoutes);
start();