import { prisma } from "../lib/prisma";

export class TradeService {
  async getUserTrades(userId: string) {
    console.log("Requested User:", userId);

    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          {
            buyOrder: {
              userId,
            },
          },
          {
            sellOrder: {
              userId,
            },
          },
        ],
      },
      include: {
        market: true,
        buyOrder: true,
        sellOrder: true,
      },
      orderBy: {
        executedAt: "desc",
      },
    });

    console.log(
      "Trades Found:",
      trades.map((trade) => ({
        tradeId: trade.id,
        buyerUserId: trade.buyOrder.userId,
        sellerUserId: trade.sellOrder.userId,
      })),
    );

    return trades.map((trade) => ({
      id: trade.id,
      market: trade.market.symbol,
      side: trade.buyOrder.userId === userId ? "BUY" : "SELL",
      price: Number(trade.price),
      quantity: Number(trade.quantity),
      total: Number(trade.price) * Number(trade.quantity),
      executedAt: trade.executedAt,
    }));
  }
}

export const tradeService = new TradeService();