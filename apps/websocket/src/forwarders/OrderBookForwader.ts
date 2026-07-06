import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  OrderBookUpdatedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "../SubscriptionManager";

export function startOrderBookForwarder() {
  redisSubscriber.subscribe<OrderBookUpdatedEvent>(
    EventNames.ORDERBOOK_UPDATED,
    (event: EventEnvelope<OrderBookUpdatedEvent>) => {
      subscriptionManager.broadcast(
        "orderbook",
        event.payload.marketSymbol,
        event
      );
    }
  );
}