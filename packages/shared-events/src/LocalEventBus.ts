import { EventEmitter } from "events";
import { IEventBus } from "./IEventBus";

export class LocalEventBus implements IEventBus {
  private emitter = new EventEmitter();

  async publish<T>(
    channel: string,
    payload: T
  ): Promise<void> {
    this.emitter.emit(channel, payload);
  }

  subscribe<T>(
    channel: string,
    listener: (payload: T) => void
  ): void {
    this.emitter.on(channel, listener);
  }
}