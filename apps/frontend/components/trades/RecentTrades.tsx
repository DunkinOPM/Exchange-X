"use client";

import { useTradesStore } from "../../store/tradesStore";

export default function RecentTrades() {
  const trades = useTradesStore((s) => s.trades);

  return (
    <div className="h-full rounded-lg bg-zinc-900 p-4 overflow-auto">
      <h2 className="font-semibold mb-4">Recent Trades</h2>

      {trades.length === 0 ? (
        <div className="text-zinc-500 text-sm">
          No trades yet
        </div>
      ) : (
        trades.map((trade, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-zinc-800 py-2 text-sm"
          >
            <span className="text-green-400">
              {trade.price}
            </span>

            <span>{trade.quantity}</span>

            <span className="text-zinc-500">
              {new Date(trade.executedAt).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}