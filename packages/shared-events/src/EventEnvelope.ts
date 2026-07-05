export interface EventEnvelope<T> {
  type: string;

  timestamp: string;

  payload: T;
}