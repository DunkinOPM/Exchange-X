import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../lib/jwt";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      email: string;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.code(401).send({
      message: "Authorization header missing.",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    request.user = verifyToken(token);
  } catch {
    return reply.code(401).send({
      message: "Invalid or expired token.",
    });
  }
}