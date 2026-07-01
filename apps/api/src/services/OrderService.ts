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

    const result = matchingEngine.submitOrder(engineOrder);

    await prisma.$transaction(async (tx) => {
      for (const trade of result.trades) {
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
        for (const updatedOrder of result.updatedOrders) {
          await tx.order.update({
            where: {
              id: updatedOrder.id,
            },
            data: {
              status: updatedOrder.status,
              filledQuantity: updatedOrder.filledQuantity,
            },
          });
        }
      }
    });

    return {
      order,
      trades : result.trades,
    };
  }
}

export const orderService = new OrderService();
