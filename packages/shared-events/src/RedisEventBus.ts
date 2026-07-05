import { IEventBus } from "./IEventBus";
import { redisPublisher } from "@exchange/redis";

export class RedisEventBus implements IEventBus {
  async publish<T>(
    channel: string,
    payload: T
  ): Promise<void> {
    await redisPublisher.publish(channel, payload);
  }

  subscribe<T>(): void {
    // Redis subscriptions will be handled
    // by dedicated services (WebSocket, Analytics).
  }
}