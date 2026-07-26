"use client";

import OrderBook from "../orderbook/OrderBook";
import TradingChart from "../charts/TradingChart";
import RecentTrades from "../trades/RecentTrades";
import BuySellPanel from "../trading/BuySellPanel";
import Portfolio from "../portfolio/Portfolio";
import OpenOrders from "../orders/OpenOrders";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-1 gap-2">

        {/* Order Book */}
        <div className="w-80">
          <OrderBook />
        </div>

        {/* Center */}
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
      <div className="mt-2 h-60">
        <Portfolio />
      </div>
    </>
  );
}