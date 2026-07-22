"use client";

import Header from "./Header";
import OrderBook from "../orderbook/OrderBook";
import TradingChart from "../charts/TradingChart";
import RecentTrades from "../trades/RecentTrades";
import BuySellPanel from "../trading/BuySellPanel";
import Portfolio from "../portfolio/Portfolio";
import OpenOrders from "../orders/OpenOrders";
import { useMarketSocket } from "../../hooks/useMarketSocket";

export default function DashboardLayout() {
  useMarketSocket();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="h-screen flex flex-col">

        <Header />

        <div className="flex flex-1 gap-2 p-2">

          {/* Order Book */}
          <div className="w-80">
            <OrderBook />
          </div>

          {/* Center Panel */}
          <div className="flex-1 flex flex-col gap-2">

            <div className="flex-1">
              <TradingChart />
            </div>

            <div className="h-72">
              <BuySellPanel />
            </div>

            <div className="h-64">
              <OpenOrders />
            </div>

          </div>

          {/* Recent Trades */}
          <div className="w-80">
            <RecentTrades />
          </div>

        </div>

        {/* Portfolio */}
        <div className="h-60 p-2">
          <Portfolio />
        </div>

      </div>
    </main>
  );
}