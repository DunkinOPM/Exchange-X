"use client";

import { useMemo } from "react";
import { useMyTradesStore } from "../../store/myTradesStore";
export default function TradeHistoryTable() {
  const { trades, loading, error } = useMyTradesStore();

  const rows = useMemo(() => trades, [trades]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 rounded bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="text-5xl">📈</div>

        <h2 className="mt-4 text-xl font-semibold text-white">
          No Trade History
        </h2>

        <p className="mt-2">Your completed trades will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-900">
          <tr className="border-b border-zinc-800 text-zinc-400">
            <th className="py-3 text-left">Market</th>
            <th className="py-3">Side</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Quantity</th>
            <th className="py-3 text-right">Total</th>
            <th className="py-3 text-right">Time</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade) => (
            <tr
              key={`${trade.id}-${trade.side}`}
              className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
            >
              <td className="py-3 font-medium">{trade.market}</td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    trade.side === "BUY"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {trade.side}
                </span>
              </td>

              <td className="text-right font-mono">
                {trade.price.toLocaleString()}
              </td>

              <td className="text-right font-mono">
                {trade.quantity.toFixed(4)}
              </td>

              <td className="text-right font-semibold">
                {trade.total.toLocaleString()}
              </td>

              <td className="text-right text-zinc-400">
                {new Date(trade.executedAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
