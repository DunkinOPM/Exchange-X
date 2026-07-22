import { FastifyInstance } from "fastify";
import { candleService } from "../services/CandleService";

export async function candleRoutes(app: FastifyInstance) {
  app.get("/candles/:market", async (request) => {
    const { market } = request.params as {
      market: string;
    };

    return candleService.getCandles(market);
  });
}