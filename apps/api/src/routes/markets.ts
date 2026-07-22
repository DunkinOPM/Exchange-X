import { FastifyInstance } from "fastify";
import { matchingEngine } from "../lib/matchingEngine";

export async function marketRoutes(app: FastifyInstance) {
  app.get("/markets/:symbol/orderbook", async (request) => {
    const { symbol } = request.params as {
      symbol: string;
    };

    return matchingEngine.getOrderBookSnapshot(symbol);
  });

  app.get("/markets/:symbol/ticker", async (request) => {
    const { symbol } = request.params as {
      symbol: string;
    };

    return matchingEngine.getTicker(symbol);
  });
}