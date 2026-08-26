"use client";

import { useEffect } from "react";

import { getSocket } from "../services/ws";

import { useMarketStore } from "../store/marketStore";
import { useTickerStore } from "../store/tickerStore";
import { useTradesStore } from "../store/tradesStore";
import { useOrderBookStore } from "../store/orderBookStore";
import { toast } from "sonner";
import { useCandleStore } from "../store/candleStore";

export function useMarketSocket() {
  const market = useMarketStore((s) => s.selectedMarket);

  const setTicker = useTickerStore((s) => s.setTicker);

  const addTrade = useTradesStore((s) => s.addTrade);

  const setBook = useOrderBookStore((s) => s.setBook);

  const updateCandle = useCandleStore((s) => s.updateCandle);
  const clearCandles = useCandleStore((s) => s.clear);

  useEffect(() => {
    const socket = getSocket();
    clearCandles();
    const channels = ["ticker", "trades", "orderbook", "candles"] as const;

    const subscribe = () => {
      channels.forEach((channel) => {
        socket.send(
          JSON.stringify({
            type: "SUBSCRIBE",
            channel,
            market,
          }),
        );
      });
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

      console.log("📨 FULL MESSAGE:", message);

      switch (message.type) {
        case "ticker.updated":
          setTicker(message.payload.ticker);
          break;

        case "orderbook.updated":
          console.log("ORDERBOOK PAYLOAD:", message.payload);
          console.log("SNAPSHOT:", message.payload.snapshot);
          setBook(message.payload.snapshot);
          break;

        case "candle.updated":
          console.log(message.payload.candle);
          updateCandle(message.payload.candle);
          break;

        case "order.matched": {
          console.log("✅ Trade received", message.payload);

          addTrade(message.payload);

          const trade = message.payload;

          toast.success("Trade Executed", {
            description: `${trade.marketSymbol} • ${Number(
              trade.quantity,
            ).toLocaleString()} @ ${Number(trade.price).toLocaleString()}`,
          });

          break;
        }
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);

      if (socket.readyState === WebSocket.OPEN) {
        channels.forEach((channel) => {
          socket.send(
            JSON.stringify({
              type: "UNSUBSCRIBE",
              channel,
              market,
            }),
          );
        });
      }
    };
  }, [market, setTicker, addTrade, setBook, updateCandle, clearCandles]);
}
