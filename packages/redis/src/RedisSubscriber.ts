import Redis from "ioredis";
import { EventEnvelope } from "@exchange/shared-events";

const subscriber = new Redis({
  host: "localhost",
  port: 6379,
});

export class RedisSubscriber {
  private callbacks = new Map<
    string,
    (event: EventEnvelope<any>) => void
  >();

  constructor() {
    subscriber.on("message", (channel, message) => {
      const callback = this.callbacks.get(channel);

      if (!callback) return;

      callback(JSON.parse(message));
    });
  }

  async subscribe<T>(
    channel: string,
    callback: (event: EventEnvelope<T>) => void
  ) {
    this.callbacks.set(
      channel,
      callback as (event: EventEnvelope<any>) => void
    );

    await subscriber.subscribe(channel);
  }
}

export const redisSubscriber = new RedisSubscriber();