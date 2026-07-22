"use client";

import { useOrderBookStore } from "../../store/orderBookStore";

export default function OrderBook() {
  

  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);

  console.log("Bids:", bids);
  console.log("Asks:", asks);

  return (
  <div className="bg-red-500 text-white p-4">
    <h1>ORDER BOOK TEST</h1>

    <pre>{JSON.stringify({ bids, asks }, null, 2)}</pre>
  </div>
);
}
