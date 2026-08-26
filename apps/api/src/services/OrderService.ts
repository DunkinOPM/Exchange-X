import { prisma } from "../lib/prisma";
import { matchingEngine } from "../lib/matchingEngine";
import { toEngineOrder } from "../utils/orderMapper";
import { eventBus, EventNames } from "@exchange/shared-events";
import { walletService } from "./WalletService";
import { settlementService } from "./SettlementService";
import { candleService } from "./CandleService";
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
      let requiredQuote: number;

      if (body.type === "LIMIT") {
        if (body.price === undefined) {
          throw new Error("Price is required for LIMIT BUY.");
        }

        requiredQuote = body.price * body.quantity;
      } else {
        requiredQuote = matchingEngine.estimateMarketBuyCost(
          market.symbol,
          body.quantity,
        );
      }

      await walletService.lockBalance(
        body.userId,
        market.quoteAssetSymbol,
        requiredQuote,
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
    console.log("Trades:", result.trades.length);
    console.log(result.trades);

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

      candleService.processTrade(
        market.symbol,
        trade.price,
        trade.quantity,
        trade.executedAt,
      );
      console.log(
        "🕯️ Candle Updated:",
        candleService.getCurrentCandle(market.symbol),
      );
    }
    console.log("🚀 Publishing ORDERBOOK_UPDATED");
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

      const candle = candleService.getCurrentCandle(market.symbol);

      if (candle) {
        await eventBus.publish(EventNames.CANDLE_UPDATED, {
          marketSymbol: market.symbol,
          candle,
        });
      }
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

  async cancelOrder(orderId: string, userId: string) {
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

    if (order.userId !== userId) {
      throw new Error("You are not authorized to cancel this order.");
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
  async getOpenOrders(userId: string, market?: string) {
    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: {
          in: ["PENDING", "PARTIALLY_FILLED"],
        },
        ...(market && {
          market: {
            symbol: market,
          },
        }),
      },
      include: {
        market: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      price: order.price ? Number(order.price) : null,
      quantity: Number(order.quantity),
      filledQuantity: Number(order.filledQuantity),
    }));
  }
}
export const orderService = new OrderService();
