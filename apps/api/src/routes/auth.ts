import { FastifyInstance } from "fastify";
import { authService } from "../services/AuthService";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    try {
      const { email, username, password } = request.body as {
        email: string;
        username: string;
        password: string;
      };

      const result = await authService.register(
        email,
        username,
        password,
      );

      return reply.code(201).send(result);
    } catch (err) {
      return reply.code(400).send({
        message:
          err instanceof Error ? err.message : "Registration failed.",
      });
    }
  });

  app.post("/login", async (request, reply) => {
    try {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const result = await authService.login(
        email,
        password,
      );

      return reply.send(result);
    } catch (err) {
      return reply.code(401).send({
        message:
          err instanceof Error ? err.message : "Login failed.",
      });
    }
  });
}