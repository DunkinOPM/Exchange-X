import { FastifyInstance } from "fastify";
import { tradeService } from "../services/TradeService";

export async function tradeRoutes(app: FastifyInstance) {
  app.get("/me", async (request) => {
    const { userId } = request.query as {
      userId: string;
    };

    return tradeService.getUserTrades(userId);
  });
}