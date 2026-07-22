import { prisma } from "../lib/prisma";
export class SettlementService {
  async settleTrade(
    buyerId: string,
    sellerId: string,
    baseAsset: string,
    quoteAsset: string,
    price: number,
    quantity: number,
  ) {
    const total = price * quantity;

    await prisma.$transaction(async (tx) => {
      // Buyer receives base asset
      await tx.balance.upsert({
        where: {
          userId_asset: {
            userId: buyerId,
            asset: baseAsset,
          },
        },
        update: {
          available: {
            increment: quantity,
          },
          locked: {
            decrement: 0,
          },
        },
        create: {
          userId: buyerId,
          asset: baseAsset,
          available: quantity,
          locked: 0,
        },
      });

      // Buyer spends locked quote asset
      await tx.balance.update({
        where: {
          userId_asset: {
            userId: buyerId,
            asset: quoteAsset,
          },
        },
        data: {
          locked: {
            decrement: total,
          },
        },
      });

      // Seller releases locked base asset
      await tx.balance.update({
        where: {
          userId_asset: {
            userId: sellerId,
            asset: baseAsset,
          },
        },
        data: {
          locked: {
            decrement: quantity,
          },
        },
      });

      // Seller receives quote asset
      await tx.balance.upsert({
        where: {
          userId_asset: {
            userId: sellerId,
            asset: quoteAsset,
          },
        },
        update: {
          available: {
            increment: total,
          },
        },
        create: {
          userId: sellerId,
          asset: quoteAsset,
          available: total,
          locked: 0,
        },
      });
    });
  }
}

export const settlementService = new SettlementService();