import { WebSocketServer, WebSocket } from "ws";
import { subscriptionManager } from "./SubscriptionManager";
import { startEventForwarder } from "./EventForwarder";

const PORT = 5000;

startEventForwarder();

const wss = new WebSocketServer({
  port: PORT,
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket) => {
  console.log("✅ Client connected");

  // Track this client's subscriptions
  const clientSubscriptions: {
    channel: string;
    market: string;
  }[] = [];

  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Welcome to Exchange WS",
      timestamp: new Date().toISOString(),
    })
  );

  ws.on("message", (raw) => {
    try {
      const message = JSON.parse(raw.toString());

      switch (message.type) {
        case "SUBSCRIBE": {
          if (!message.channel || !message.market) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "channel and market are required",
              })
            );
            return;
          }

          subscriptionManager.subscribe(
            message.channel,
            message.market,
            ws
          );

          clientSubscriptions.push({
            channel: message.channel,
            market: message.market,
          });

          ws.send(
            JSON.stringify({
              type: "subscribed",
              channel: message.channel,
              market: message.market,
            })
          );

          console.log(
            `📈 Client subscribed to ${message.channel}:${message.market}`
          );

          break;
        }

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Unknown message type",
            })
          );
      }
    } catch (err) {
      console.error(err);

      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON",
        })
      );
    }
  });

  ws.on("close", () => {
    for (const sub of clientSubscriptions) {
      subscriptionManager.unsubscribe(
        sub.channel,
        sub.market,
        ws
      );
    }

    console.log("❌ Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
});