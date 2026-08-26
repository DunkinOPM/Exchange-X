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

  const clientSubscriptions: {
    channel: string;
    market: string;
  }[] = [];

  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Welcome to Exchange WS",
      timestamp: new Date().toISOString(),
    }),
  );

  ws.on("message", async (raw) => {
    try {
      const message = JSON.parse(raw.toString());

      switch (message.type) {
        case "SUBSCRIBE": {
          if (!message.channel || !message.market) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "channel and market are required",
              }),
            );
            return;
          }

          subscriptionManager.subscribe(
            message.channel,
            message.market,
            ws,
          );

          // Immediately send current state
          try {
            switch (message.channel) {
              case "orderbook": {
                const response = await fetch(
                  `http://localhost:4000/orderbook/${message.market}`,
                );

                if (response.ok) {
                  const snapshot = await response.json();

                  ws.send(
                    JSON.stringify({
                      type: "orderbook.updated",
                      timestamp: new Date().toISOString(),
                      payload: {
                        marketSymbol: message.market,
                        snapshot,
                      },
                    }),
                  );
                }

                break;
              }

              case "ticker": {
                const response = await fetch(
                  `http://localhost:4000/ticker/${message.market}`,
                );

                if (response.ok) {
                  const ticker = await response.json();

                  ws.send(
                    JSON.stringify({
                      type: "ticker.updated",
                      timestamp: new Date().toISOString(),
                      payload: {
                        marketSymbol: message.market,
                        ticker,
                      },
                    }),
                  );
                }

                break;
              }

              case "trades": {
                const response = await fetch(
                  `http://localhost:4000/trades?market=${message.market}`,
                );

                if (response.ok) {
                  const data = await response.json();

                  ws.send(
                    JSON.stringify({
                      type: "trades.snapshot",
                      timestamp: new Date().toISOString(),
                      payload: data,
                    }),
                  );
                }

                break;
              }

              case "candles": {
                const response = await fetch(
                  `http://localhost:4000/candles/${message.market}`,
                );

                if (response.ok) {
                  const candles = await response.json();

                  ws.send(
                    JSON.stringify({
                      type: "candles.snapshot",
                      timestamp: new Date().toISOString(),
                      payload: {
                        marketSymbol: message.market,
                        candles,
                      },
                    }),
                  );
                }

                break;
              }
            }
          } catch (err) {
            console.error(
              "Failed to send initial snapshot:",
              err,
            );
          }

          clientSubscriptions.push({
            channel: message.channel,
            market: message.market,
          });

          ws.send(
            JSON.stringify({
              type: "subscribed",
              channel: message.channel,
              market: message.market,
            }),
          );

          console.log(
            `📈 Client subscribed to ${message.channel}:${message.market}`,
          );

          break;
        }

        case "UNSUBSCRIBE": {
          if (!message.channel || !message.market) {
            return;
          }

          subscriptionManager.unsubscribe(
            message.channel,
            message.market,
            ws,
          );

          const index = clientSubscriptions.findIndex(
            (sub) =>
              sub.channel === message.channel &&
              sub.market === message.market,
          );

          if (index !== -1) {
            clientSubscriptions.splice(index, 1);
          }

          ws.send(
            JSON.stringify({
              type: "unsubscribed",
              channel: message.channel,
              market: message.market,
            }),
          );

          console.log(
            `📉 Client unsubscribed from ${message.channel}:${message.market}`,
          );

          break;
        }

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Unknown message type",
            }),
          );
      }
    } catch (err) {
      console.error(err);

      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON",
        }),
      );
    }
  });

  ws.on("close", () => {
    for (const sub of clientSubscriptions) {
      subscriptionManager.unsubscribe(
        sub.channel,
        sub.market,
        ws,
      );
    }

    console.log("❌ Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket Error:", err);
  });
});