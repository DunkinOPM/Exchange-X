"use client";

import { useOrderBookStore } from "../../store/orderBookStore";

export default function OrderBook() {
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);

  return (
    <div className="h-full rounded-lg bg-zinc-900 p-4">
      <h2 className="mb-4 text-xl font-bold">Order Book</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <h3 className="mb-2 text-green-500 font-semibold">Bids</h3>

          <table className="w-full text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="text-left">Price</th>
                <th className="text-right">Qty</th>
              </tr>
            </thead>

            <tbody>
              {bids.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="py-3 text-center text-zinc-500"
                  >
                    No bids
                  </td>
                </tr>
              ) : (
                bids.map((level, index) => (
                  <tr
                    key={`${level.price}-${index}`}
                    className="border-b border-zinc-800"
                  >
                    <td className="text-green-400 font-mono">
                      {level.price.toLocaleString()}
                    </td>

                    <td className="text-right font-mono">
                      {level.quantity.toFixed(4)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Asks */}
        <div>
          <h3 className="mb-2 text-red-500 font-semibold">Asks</h3>

          <table className="w-full text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="text-left">Price</th>
                <th className="text-right">Qty</th>
              </tr>
            </thead>

            <tbody>
              {asks.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="py-3 text-center text-zinc-500"
                  >
                    No asks
                  </td>
                </tr>
              ) : (
                asks.map((level, index) => (
                  <tr
                    key={`${level.price}-${index}`}
                    className="border-b border-zinc-800"
                  >
                    <td className="text-red-400 font-mono">
                      {level.price.toLocaleString()}
                    </td>

                    <td className="text-right font-mono">
                      {level.quantity.toFixed(4)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}