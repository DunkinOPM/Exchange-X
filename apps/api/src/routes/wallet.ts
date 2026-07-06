import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function walletRoutes(app: FastifyInstance) {
  app.get("/wallet/:userId", async (request) => {
    const { userId } = request.params as {
      userId: string;
    };

    return prisma.balance.findMany({
      where: {
        userId,
      },
      orderBy: {
        asset: "asc",
      },
    });
  });
}