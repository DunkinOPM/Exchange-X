import WebSocket from "ws";

export class SubscriptionManager {
  private subscriptions = new Map<string, Set<WebSocket>>();

  subscribe(channel: string, market: string, client: WebSocket) {
    const key = `${channel}:${market}`;

    let clients = this.subscriptions.get(key);

    if (!clients) {
      clients = new Set();

      this.subscriptions.set(key, clients);
    }

    clients.add(client);
  }

  unsubscribe(channel: string, market: string, client: WebSocket) {
    const key = `${channel}:${market}`;

    const clients = this.subscriptions.get(key);

    if (!clients) return;

    clients.delete(client);

    if (clients.size === 0) {
      this.subscriptions.delete(key);
    }
  }

  broadcast(channel: string, market: string, message: unknown) {
    const key = `${channel}:${market}`;

    const clients = this.subscriptions.get(key);

    if (!clients) return;

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }
}

export const subscriptionManager = new SubscriptionManager();
