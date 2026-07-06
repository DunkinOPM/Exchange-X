import { prisma } from "../lib/prisma";
import { matchingEngine } from "../lib/matchingEngine";
import { toEngineOrder } from "../utils/orderMapper";
import { eventBus, EventNames } from "@exchange/shared-events";
import { walletService } from "./WalletService";
import { settlementService } from "./SettlementService";

export class OrderService {
  async createOrder(body: {
    userId: string;
    market: string;
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    price?: number;
    quantity: number;
  }) {
    // Find market
    const market = await prisma.market.findUnique({
      where: {
        symbol: body.market,
      },
    });

    if (!market) {
      throw new Error("Market not found.");
    }
    if (body.side === "BUY") {
      if (body.price === undefined) {
        throw new Error("Price is required for BUY orders.");
      }

      await walletService.lockBalance(
        body.userId,
        market.quoteAssetSymbol,
        body.price * body.quantity,
      );
    } else {
      await walletService.lockBalance(
        body.userId,
        market.baseAssetSymbol,
        body.quantity,
      );
    }
    // Create order
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
    engineOrder.marketSymbol = market.symbol;

    // Handle market orders
    if (body.type === "MARKET") {
      if (body.side === "BUY") {
        engineOrder.price = Number.MAX_SAFE_INTEGER;
      } else {
        engineOrder.price = 0;
      }
    }
    // Match order
    const result = matchingEngine.submitOrder(engineOrder);

    // Persist trades & order updates
    await prisma.$transaction(async (tx) => {
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
    for (const trade of result.trades) {
  const buyOrder = await prisma.order.findUnique({
    where: {
      id: trade.buyOrderId,
    },
    include: {
      market: true,
    },
  });

  const sellOrder = await prisma.order.findUnique({
    where: {
      id: trade.sellOrderId,
    },
    include: {
      market: true,
    },
  });

  if (!buyOrder || !sellOrder) {
    continue;
  }

  await settlementService.settleTrade(
    buyOrder.userId,
    sellOrder.userId,
    buyOrder.market.baseAssetSymbol,
    buyOrder.market.quoteAssetSymbol,
    trade.price,
    trade.quantity,
  );
}

    // Publish ORDER_PLACED
    await eventBus.publish(EventNames.ORDER_PLACED, {
      orderId: order.id,
      marketSymbol: market.symbol,
      side: order.side,
      price: Number(order.price),
      quantity: Number(order.quantity),
    });

    // Publish ORDER_MATCHED
    for (const trade of result.trades) {
      await eventBus.publish(EventNames.ORDER_MATCHED, {
        buyOrderId: trade.buyOrderId,
        sellOrderId: trade.sellOrderId,
        marketSymbol: market.symbol,
        price: trade.price,
        quantity: trade.quantity,
        executedAt: trade.executedAt,
      });
    }

    // Publish OrderBook & Ticker updates
    const snapshot = matchingEngine.getOrderBookSnapshot(market.symbol);
    const ticker = matchingEngine.getTicker(market.symbol);

    await eventBus.publish(EventNames.ORDERBOOK_UPDATED, {
      marketSymbol: market.symbol,
      snapshot,
    });

    await eventBus.publish(EventNames.TICKER_UPDATED, {
      marketSymbol: market.symbol,
      ticker,
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
      orderId,
    );

    if (!removedOrder) {
      throw new Error("Order not found in matching engine.");
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    await eventBus.publish(EventNames.ORDER_CANCELLED, {
      orderId,
      marketSymbol: order.market.symbol,
    });

    const snapshot = matchingEngine.getOrderBookSnapshot(order.market.symbol);
    const ticker = matchingEngine.getTicker(order.market.symbol);

    await eventBus.publish(EventNames.ORDERBOOK_UPDATED, {
      marketSymbol: order.market.symbol,
      snapshot,
    });

    await eventBus.publish(EventNames.TICKER_UPDATED, {
      marketSymbol: order.market.symbol,
      ticker,
    });

    return updatedOrder;
  }
}

export const orderService = new OrderService();
