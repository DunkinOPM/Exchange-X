import { EngineOrder } from "../models/EngineOrder";
import { Trade } from "../models/Trade";

export class OrderBook {
  private bids: Map<number, EngineOrder[]> = new Map();
  private asks: Map<number, EngineOrder[]> = new Map();

  addOrder(order: EngineOrder): Trade[] {
    if (order.side === "BUY") {
      return this.matchBuyOrder(order);
    }

    return this.matchSellOrder(order);
  }

  private matchBuyOrder(buyOrder: EngineOrder): Trade[] {
    const trades: Trade[] = [];

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

        trades.push({
          buyOrderId: buyOrder.id,
          sellOrderId: sellOrder.id,
          price: askPrice,
          quantity: tradeQuantity,
          executedAt: new Date(),
        });

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

    return trades;
  }

  private matchSellOrder(sellOrder: EngineOrder): Trade[] {
    const trades: Trade[] = [];

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

        trades.push({
          buyOrderId: buyOrder.id,
          sellOrderId: sellOrder.id,
          price: bidPrice,
          quantity: tradeQuantity,
          executedAt: new Date(),
        });

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

    return trades;
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

  getBids() {
    return this.bids;
  }

  getAsks() {
    return this.asks;
  }
}
