import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});
console.log("DATABASE_URL =", process.env.DATABASE_URL);
import Fastify from "fastify";
import { orderRoutes } from "./routes/orders";
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