import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  OrderPlacedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "../SubscriptionManager";

export function startOrderPlacedForwarder() {
  redisSubscriber.subscribe<OrderPlacedEvent>(
    EventNames.ORDER_PLACED,
    (event: EventEnvelope<OrderPlacedEvent>) => {
      subscriptionManager.broadcast(
        "orders",
        event.payload.marketSymbol,
        event
      );
    }
  );
}