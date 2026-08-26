import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { prisma } from "../lib/prisma";
import { matchingEngine } from "../lib/matchingEngine";

import { authenticate } from "../middleware/auth";

import { CreateOrderSchema } from "../schemas/order";
import { orderService } from "../services/OrderService";

export async function orderRoutes(app: FastifyInstance) {
  app.post(
    "/orders",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      try {
        const body = CreateOrderSchema.parse(request.body);

        const { order, trades } = await orderService.createOrder({
          ...body,
          userId: request.user.userId,
        });

        return reply.code(201).send({
          order,
          trades,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            error: "Validation Error",
            details: error.issues,
          });
        }

        if (error instanceof Error) {
          console.error(error);

          if (
            error.message === "Insufficient balance." ||
            error.message.includes("Balance") ||
            error.message.includes("not found")
          ) {
            return reply.code(400).send({
              error: error.message,
            });
          }

          return reply.code(500).send({
            error: error.message,
          });
        }

        return reply.code(500).send({
          error: "Unknown error",
        });
      }
    },
  );

  app.get("/orders", async () => {
    const orders = await prisma.order.findMany();

    return {
      orders,
    };
  });

  app.post(
    "/orders/:id/cancel",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const { id } = request.params as {
        id: string;
      };

      try {
        const order = await orderService.cancelOrder(
          id,
          request.user.userId,
        );

        return reply.send({
          message: "Order cancelled.",
          order,
        });
      } catch (error) {
        console.error("\n========== CANCEL ORDER ERROR ==========");
        console.error(error);

        if (error instanceof Error) {
          console.error("Message:", error.message);
          console.error("Stack:");
          console.error(error.stack);
        }

        console.error("========================================\n");

        return reply.code(400).send({
          error:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });
      }
    },
  );

  app.get("/trades", async () => {
    const trades = await prisma.trade.findMany();

    return {
      trades,
    };
  });

  app.get("/orderbook/:market", async (request, reply) => {
    const { market } = request.params as {
      market: string;
    };

    const orderBook =
      matchingEngine.getOrderBookSnapshot(market);

    return reply.send(orderBook);
  });

  app.get("/ticker/:market", async (request, reply) => {
    const { market } = request.params as {
      market: string;
    };

    return reply.send(
      matchingEngine.getTicker(market),
    );
  });

  app.get(
    "/orders/open",
    {
      preHandler: authenticate,
    },
    async (request) => {
      const { market } = request.query as {
        market?: string;
      };

      return orderService.getOpenOrders(
        request.user.userId,
        market,
      );
    },
  );
}