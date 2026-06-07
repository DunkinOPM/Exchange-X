import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { CreateOrderSchema } from "../schemas/order";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    try {
      const body = CreateOrderSchema.parse(request.body);

      return reply.code(201).send({
        message: "Order received",
        order: body,
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
    return {
      orders: [],
    };
  });
}
