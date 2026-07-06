import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  OrderMatchedEvent,
  OrderBookUpdatedEvent,
  TickerUpdatedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "./SubscriptionManager";

export function startEventForwarder() {
  console.log("📡 Listening for Redis events...");

  // Trade executions
  redisSubscriber.subscribe<OrderMatchedEvent>(
    EventNames.ORDER_MATCHED,
    (event: EventEnvelope<OrderMatchedEvent>) => {
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
      subscriptionManager.broadcast(
        "ticker",
        event.payload.marketSymbol,
        event,
      );
    },
  );
}