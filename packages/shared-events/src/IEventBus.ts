export interface IEventBus {
  publish<T>(
    channel: string,
    payload: T
  ): Promise<void>;

  subscribe<T>(
    channel: string,
    listener: (payload: T) => void
  ): void;
}