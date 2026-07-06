import { prisma } from "../lib/prisma";

export class WalletService {
  async getBalance(userId: string, asset: string) {
    const balance = await prisma.balance.findUnique({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
    });

    if (!balance) {
      throw new Error(`Balance for ${asset} not found.`);
    }

    return balance;
  }

  async lockBalance(
    userId: string,
    asset: string,
    amount: number
  ) {
    const balance = await this.getBalance(userId, asset);

    if (Number(balance.available) < amount) {
      throw new Error("Insufficient balance.");
    }

    return prisma.balance.update({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      data: {
        available: {
          decrement: amount,
        },
        locked: {
          increment: amount,
        },
      },
    });
  }

  async unlockBalance(
    userId: string,
    asset: string,
    amount: number
  ) {
    return prisma.balance.update({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      data: {
        available: {
          increment: amount,
        },
        locked: {
          decrement: amount,
        },
      },
    });
  }
}

export const walletService = new WalletService();