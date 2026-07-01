import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";
import { CreateOrderSchema } from "../schemas/order";
import { orderService } from "../services/OrderService";

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

  app.get("/trades", async () => {
    const trades = await prisma.trade.findMany();

    return {
      trades,
    };
  });
}