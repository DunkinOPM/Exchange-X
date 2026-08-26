import { FastifyInstance } from "fastify";

import { authenticate } from "../middleware/auth";
import { tradeService } from "../services/TradeService";

export async function tradeRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const userId = request.user.userId;

      return tradeService.getUserTrades(userId);
    },
  );
}