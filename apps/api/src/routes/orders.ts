import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { prisma } from "../lib/prisma";
import { CreateOrderSchema } from "../schemas/order";

export async function orderRoutes(
  app: FastifyInstance
) {
  app.post("/orders", async (request, reply) => {
    try {
      const body =
        CreateOrderSchema.parse(request.body);

      const order = await prisma.order.create({
        data: {
          userId: body.userId,
          marketId: body.marketId,

          side: body.side,
          type: body.type,

          price: body.price,

          quantity: body.quantity,
        },
      });

      return reply.code(201).send(order);
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
    const orders =
      await prisma.order.findMany();

    return {
      orders,
    };
  });
}