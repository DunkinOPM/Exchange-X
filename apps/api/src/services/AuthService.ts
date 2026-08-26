import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken } from "../lib/jwt";

export class AuthService {
  async register(email: string, username: string, password: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          passwordHash,
        },
      });

      await tx.balance.createMany({
        data: [
          {
            userId: user.id,
            asset: "USDT",
            available: 100000,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "BTC",
            available: 1,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "ETH",
            available: 10,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "SOL",
            available: 100,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "BNB",
            available: 25,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "ADA",
            available: 10000,
            locked: 0,
          },
          {
            userId: user.id,
            asset: "DOGE",
            available: 50000,
            locked: 0,
          },
        ],
      });

      return user;
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error("Invalid email or password.");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}

export const authService = new AuthService();
