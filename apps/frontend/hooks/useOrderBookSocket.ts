"use client";

import { useEffect } from "react";
import { getSocket } from "../services/ws";
import { useOrderBookStore } from "../store/orderBookStore";
import { fetchOrderBook } from "../services/market";

export function useOrderBookSocket(market = "BTCUSDT") {
  const setBook = useOrderBookStore((s) => s.setBook);

  useEffect(() => {
    fetchOrderBook(market).then((snapshot) => {
      setBook(snapshot);
    });
    const socket = getSocket();

    const subscribe = () => {
      socket.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          channel: "orderbook",
          market,
        }),
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      subscribe();
    } else {
      socket.addEventListener("open", subscribe, {
        once: true,
      });
    }

    const onMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      console.log("📨 WS Received:", message);

      if (message.payload?.snapshot) {
        console.log(
          "📚 Snapshot:",
          JSON.stringify(message.payload.snapshot, null, 2),
        );

        setBook(message.payload.snapshot);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [market, setBook]);
}
