import { redis } from "./RedisClient";
import { EventEnvelope } from "@exchange/shared-events";

export class RedisPublisher {
  async publish<T>(
    channel: string,
    payload: T
  ): Promise<void> {
    const message: EventEnvelope<T> = {
      type: channel,
      timestamp: new Date().toISOString(),
      payload,
    };

    await redis.publish(
      channel,
      JSON.stringify(message)
    );
  }
}

export const redisPublisher =
  new RedisPublisher();