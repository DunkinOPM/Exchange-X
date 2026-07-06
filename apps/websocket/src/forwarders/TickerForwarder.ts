import { redisSubscriber } from "@exchange/redis";
import {
  EventEnvelope,
  EventNames,
  TickerUpdatedEvent,
} from "@exchange/shared-events";

import { subscriptionManager } from "../SubscriptionManager";

export function startTickerForwarder() {
  redisSubscriber.subscribe<TickerUpdatedEvent>(
    EventNames.TICKER_UPDATED,
    (event: EventEnvelope<TickerUpdatedEvent>) => {
      subscriptionManager.broadcast(
        "ticker",
        event.payload.marketSymbol,
        event
      );
    }
  );
}