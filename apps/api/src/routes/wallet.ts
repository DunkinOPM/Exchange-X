import { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";

export async function walletRoutes(app: FastifyInstance) {
  app.get(
    "/wallet",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const userId = request.user.userId;

      return prisma.balance.findMany({
        where: {
          userId,
        },
        orderBy: {
          asset: "asc",
        },
      });
    },
  );
}