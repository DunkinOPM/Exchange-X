import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  OrderMatchedEvent,
  OrderBookUpdatedEvent,
  TickerUpdatedEvent,
  CandleUpdatedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "./SubscriptionManager";

export function startEventForwarder() {
  console.log("📡 Listening for Redis events...");

  // Trade executions
  redisSubscriber.subscribe<OrderMatchedEvent>(
    EventNames.ORDER_MATCHED,
    (event: EventEnvelope<OrderMatchedEvent>) => {
      console.log("🟢 MATCH EVENT", event);

      subscriptionManager.broadcast(
        "trades",
        event.payload.marketSymbol,
        event,
      );
    },
  );

  // Order book updates
  redisSubscriber.subscribe<OrderBookUpdatedEvent>(
    EventNames.ORDERBOOK_UPDATED,
    (event: EventEnvelope<OrderBookUpdatedEvent>) => {
      console.log("📚 ORDERBOOK EVENT", event);

      subscriptionManager.broadcast(
        "orderbook",
        event.payload.marketSymbol,
        event,
      );
    },
  );

  // Ticker updates
  redisSubscriber.subscribe<TickerUpdatedEvent>(
    EventNames.TICKER_UPDATED,
    (event: EventEnvelope<TickerUpdatedEvent>) => {
      console.log("📈 TICKER EVENT", event);

      subscriptionManager.broadcast(
        "ticker",
        event.payload.marketSymbol,
        event,
      );
    },
  );

  // Candle updates
  redisSubscriber.subscribe<CandleUpdatedEvent>(
    EventNames.CANDLE_UPDATED,
    (event: EventEnvelope<CandleUpdatedEvent>) => {
      console.log("🕯️ CANDLE EVENT", event);

      subscriptionManager.broadcast(
        "candles",
        event.payload.marketSymbol,
        event,
      );
    },
  );
}
