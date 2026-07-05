import Redis from "ioredis";
import { EventEnvelope } from "@exchange/shared-events";

const subscriber = new Redis({
  host: "localhost",
  port: 6379,
});

export class RedisSubscriber {
  subscribe<T>(
    channel: string,
    callback: (
      event: EventEnvelope<T>
    ) => void
  ) {
    subscriber.subscribe(channel);

    subscriber.on(
      "message",
      (_, message) => {
        const event: EventEnvelope<T> =
          JSON.parse(message);

        callback(event);
      }
    );
  }
}

export const redisSubscriber =
  new RedisSubscriber();