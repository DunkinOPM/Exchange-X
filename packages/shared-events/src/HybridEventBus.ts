import { IEventBus } from "./IEventBus";
import { LocalEventBus } from "./LocalEventBus";
import { RedisEventBus } from "./RedisEventBus";

export class HybridEventBus implements IEventBus {
  private localBus = new LocalEventBus();

  private redisBus = new RedisEventBus();

  async publish<T>(
    channel: string,
    payload: T
  ): Promise<void> {
    await this.localBus.publish(channel, payload);

    await this.redisBus.publish(channel, payload);
  }

  subscribe<T>(
    channel: string,
    listener: (payload: T) => void
  ): void {
    this.localBus.subscribe(channel, listener);
  }
}