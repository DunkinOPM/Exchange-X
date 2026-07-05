import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";
import { CreateOrderSchema } from "../schemas/order";
import { orderService } from "../services/OrderService";
import { matchingEngine } from "../engine/matchingEngine";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    try {
      const body = CreateOrderSchema.parse(request.body);

      const { order, trades } = await orderService.createOrder(body);

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

      throw error;
    }
  });

  app.get("/orders", async () => {
    const orders = await prisma.order.findMany();

    return {
      orders,
    };
  });

  app.post("/orders/:id/cancel", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const order = await orderService.cancelOrder(id);

      return reply.send({
        message: "Order cancelled.",
        order,
      });
    } catch (error) {
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/trades", async () => {
    const trades = await prisma.trade.findMany();

    return {
      trades,
    };
  });

  app.get("/orderbook/:market", async (request, reply) => {
    const { market } = request.params as { market: string };
    const orderBook = matchingEngine.getOrderBookSnapshot(market);

    return reply.send(orderBook);
  });
  
  app.get("/ticker/:market", async (request, reply) => {
    const { market } = request.params as { market: string };
    return reply.send(
        matchingEngine.getTicker(market)
    );
});
}
