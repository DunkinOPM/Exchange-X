import { EngineOrder } from "../models/EngineOrder";
import { Trade } from "../models/Trade";
import { MatchingResult } from "../models/MatchingResult";

export class OrderBook {
  private bids: Map<number, EngineOrder[]> = new Map();
  private asks: Map<number, EngineOrder[]> = new Map();
  private lastTradePrice: number | null = null;

  addOrder(order: EngineOrder): MatchingResult {
    if (order.side === "BUY") {
      return this.matchBuyOrder(order);
    }

    return this.matchSellOrder(order);
  }
  cancelOrder(orderId: string): EngineOrder | null {
    // Search bids
    for (const [price, queue] of this.bids) {
      const index = queue.findIndex((order) => order.id === orderId);

      if (index !== -1) {
        const [removedOrder] = queue.splice(index, 1);

        if (queue.length === 0) {
          this.bids.delete(price);
        }

        return removedOrder;
      }
    }

    // Search asks
    for (const [price, queue] of this.asks) {
      const index = queue.findIndex((order) => order.id === orderId);

      if (index !== -1) {
        const [removedOrder] = queue.splice(index, 1);

        if (queue.length === 0) {
          this.asks.delete(price);
        }

        return removedOrder;
      }
    }

    return null;
  }

  private matchBuyOrder(buyOrder: EngineOrder): MatchingResult {
    const trades: Trade[] = [];
    const updatedOrders = new Map<string, EngineOrder>();

    const askPrices = [...this.asks.keys()].sort((a, b) => a - b);

    for (const askPrice of askPrices) {
      if (askPrice > buyOrder.price) {
        break;
      }

      const askQueue = this.asks.get(askPrice)!;

      while (
        askQueue.length > 0 &&
        buyOrder.quantity > buyOrder.filledQuantity
      ) {
        const sellOrder = askQueue[0];

        const remainingBuy = buyOrder.quantity - buyOrder.filledQuantity;

        const remainingSell = sellOrder.quantity - sellOrder.filledQuantity;

        const tradeQuantity = Math.min(remainingBuy, remainingSell);

        buyOrder.filledQuantity += tradeQuantity;
        sellOrder.filledQuantity += tradeQuantity;

        this.updateOrderStatus(buyOrder);
        this.updateOrderStatus(sellOrder);
        updatedOrders.set(buyOrder.id, buyOrder);
        updatedOrders.set(sellOrder.id, sellOrder);

        trades.push({
          buyOrderId: buyOrder.id,
          sellOrderId: sellOrder.id,
          price: askPrice,
          quantity: tradeQuantity,
          executedAt: new Date(),
        });
        this.lastTradePrice = tradeQuantity > 0 ? askPrice : this.lastTradePrice;

        if (sellOrder.filledQuantity === sellOrder.quantity) {
          askQueue.shift();
        }
      }

      if (askQueue.length === 0) {
        this.asks.delete(askPrice);
      }
    }

    if (buyOrder.filledQuantity < buyOrder.quantity) {
      this.insertBid(buyOrder);
    }

    return {
      trades,
      updatedOrders: [...updatedOrders.values()],
    };
  }

  private matchSellOrder(sellOrder: EngineOrder): MatchingResult {
    const trades: Trade[] = [];
    const updatedOrders = new Map<string, EngineOrder>();

    const bidPrices = [...this.bids.keys()].sort((a, b) => b - a);

    for (const bidPrice of bidPrices) {
      if (bidPrice < sellOrder.price) {
        break;
      }

      const bidQueue = this.bids.get(bidPrice)!;

      while (
        bidQueue.length > 0 &&
        sellOrder.quantity > sellOrder.filledQuantity
      ) {
        const buyOrder = bidQueue[0];

        const remainingBuy = buyOrder.quantity - buyOrder.filledQuantity;

        const remainingSell = sellOrder.quantity - sellOrder.filledQuantity;

        const tradeQuantity = Math.min(remainingBuy, remainingSell);

        buyOrder.filledQuantity += tradeQuantity;
        sellOrder.filledQuantity += tradeQuantity;

        this.updateOrderStatus(buyOrder);
        this.updateOrderStatus(sellOrder);
        updatedOrders.set(buyOrder.id, buyOrder);
        updatedOrders.set(sellOrder.id, sellOrder);

        trades.push({
          buyOrderId: buyOrder.id,
          sellOrderId: sellOrder.id,
          price: bidPrice,
          quantity: tradeQuantity,
          executedAt: new Date(),
        });
        this.lastTradePrice = tradeQuantity > 0 ? bidPrice : this.lastTradePrice;
        if (buyOrder.filledQuantity === buyOrder.quantity) {
          bidQueue.shift();
        }
      }

      if (bidQueue.length === 0) {
        this.bids.delete(bidPrice);
      }
    }

    if (sellOrder.filledQuantity < sellOrder.quantity) {
      this.insertAsk(sellOrder);
    }

    return {
      trades,
      updatedOrders: [...updatedOrders.values()],
    };
  }

  private insertBid(order: EngineOrder) {
    const queue = this.bids.get(order.price);

    if (queue) {
      queue.push(order);
    } else {
      this.bids.set(order.price, [order]);
    }
  }

  private insertAsk(order: EngineOrder) {
    const queue = this.asks.get(order.price);

    if (queue) {
      queue.push(order);
    } else {
      this.asks.set(order.price, [order]);
    }
  }

  private updateOrderStatus(order: EngineOrder) {
    if (order.filledQuantity === 0) {
      order.status = "PENDING";
    } else if (order.filledQuantity < order.quantity) {
      order.status = "PARTIALLY_FILLED";
    } else {
      order.status = "FILLED";
    }
  }

  private aggregateLevels(book: Map<number, EngineOrder[]>) {
    const levels = [];

    for (const [price, orders] of book) {
      let quantity = 0;

      for (const order of orders) {
        quantity += order.quantity - order.filledQuantity;
      }

      levels.push({
        price,
        quantity,
      });
    }

    return levels;
  }

  getOrderBook() {
    const bids = this.aggregateLevels(this.bids).sort(
      (a, b) => b.price - a.price,
    );

    const asks = this.aggregateLevels(this.asks).sort(
      (a, b) => a.price - b.price,
    );

    return {
      bids,
      asks,
    };
  }
  getBids() {
    return this.bids;
  }

  getAsks() {
    return this.asks;
  }
  getTicker() {
  const bids = this.aggregateLevels(this.bids);
  const asks = this.aggregateLevels(this.asks);

  const bestBid =
    bids.length > 0
      ? Math.max(...bids.map(b => b.price))
      : null;

  const bestAsk =
    asks.length > 0
      ? Math.min(...asks.map(a => a.price))
      : null;

  return {
    bestBid,
    bestAsk,
    lastPrice: this.lastTradePrice,
    spread:
      bestBid !== null && bestAsk !== null
        ? bestAsk - bestBid
        : null,
  };
}
}
