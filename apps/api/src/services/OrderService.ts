import { prisma } from "../lib/prisma";
import { matchingEngine } from "../engine/matchingEngine";
import { toEngineOrder } from "../utils/orderMapper";

export class OrderService {
  async createOrder(body: {
    userId: string;
    marketId: string;
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    price?: number;
    quantity: number;
  }) {
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

    const engineOrder = toEngineOrder(order);

    const trades = matchingEngine.submitOrder(engineOrder);

    await prisma.$transaction(async (tx) => {
      for (const trade of trades) {
        await tx.trade.create({
          data: {
            buyOrderId: trade.buyOrderId,
            sellOrderId: trade.sellOrderId,
            marketId: order.marketId,
            price: trade.price,
            quantity: trade.quantity,
            executedAt: trade.executedAt,
          },
        });

        await tx.order.update({
          where: {
            id: trade.buyOrderId,
          },
          data: {
            status: "FILLED",
            filledQuantity: trade.quantity,
          },
        });

        await tx.order.update({
          where: {
            id: trade.sellOrderId,
          },
          data: {
            status: "FILLED",
            filledQuantity: trade.quantity,
          },
        });
      }
    });

    return {
      order,
      trades,
    };
  }
}

export const orderService = new OrderService();