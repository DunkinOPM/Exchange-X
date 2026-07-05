import { prisma } from "../lib/prisma";
import { matchingEngine } from "../engine/matchingEngine";
import { toEngineOrder } from "../utils/orderMapper";

export class OrderService {
  async createOrder(body: {
    userId: string;
    market: string;
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    price?: number;
    quantity: number;
  }) {
    // Find the market by symbol
    const market = await prisma.market.findUnique({
      where: {
        symbol: body.market,
      },
    });

    if (!market) {
      throw new Error("Market not found.");
    }

    // Create the order using the database market ID
    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        marketId: market.id,
        side: body.side,
        type: body.type,
        price: body.price,
        quantity: body.quantity,
      },
    });

    // Convert to engine order
    const engineOrder = toEngineOrder(order);

    // The engine should use the market SYMBOL, not the database ID
    engineOrder.marketSymbol = market.symbol;

    const result = matchingEngine.submitOrder(engineOrder);

    await prisma.$transaction(async (tx) => {
      // Save all trades
      for (const trade of result.trades) {
        await tx.trade.create({
          data: {
            buyOrderId: trade.buyOrderId,
            sellOrderId: trade.sellOrderId,
            marketId: market.id,
            price: trade.price,
            quantity: trade.quantity,
            executedAt: trade.executedAt,
          },
        });
      }

      // Update all affected orders
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
    });

    return {
      order,
      trades: result.trades,
    };
  }

  async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        market: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status === "FILLED") {
      throw new Error("Order is already filled.");
    }

    const removedOrder = matchingEngine.cancelOrder(
      order.market.symbol,
      orderId
    );

    if (!removedOrder) {
      throw new Error("Order not found in matching engine.");
    }

    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  }
}

export const orderService = new OrderService();