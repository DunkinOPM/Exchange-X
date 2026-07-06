import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  OrderMatchedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "../SubscriptionManager";

export function startTradeForwarder() {
  redisSubscriber.subscribe<OrderMatchedEvent>(
    EventNames.ORDER_MATCHED,
    (event: EventEnvelope<OrderMatchedEvent>) => {
      subscriptionManager.broadcast(
        "trades",
        event.payload.marketSymbol,
        event
      );
    }
  );
}