"use client";

import { useMarketStore } from "../../store/marketStore";
import { useTickerStore } from "../../store/tickerStore";
import { useUserStore } from "../../store/userStore";

const BUYER_ID = "cmr962oji0000qohcbkzvige6";
const SELLER_ID = "cmr962okc0001qohcpbanm17v";

const formatPrice = (value: number | null | undefined) => {
  if (value == null) return "--";

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Header() {
  const market = useMarketStore((s) => s.selectedMarket);
  const setMarket = useMarketStore((s) => s.setMarket);

  const ticker = useTickerStore((s) => s.ticker);

  const currentUser = useUserStore((s) => s.currentUser);
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            ExchangeX
          </h1>

          <p className="text-xs text-zinc-500">
            Spot Trading
          </p>
        </div>

        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
        >
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="SOLUSDT">SOLUSDT</option>
          <option value="BNBUSDT">BNBUSDT</option>
          <option value="ADAUSDT">ADAUSDT</option>
          <option value="DOGEUSDT">DOGEUSDT</option>
        </select>
      </div>

      {/* Center */}
      <div className="flex items-center gap-4 text-sm">
        <div className="rounded-lg bg-zinc-800/50 px-4 py-2">
          <div className="text-xs text-zinc-500">Last</div>
          <div className="font-mono font-semibold text-green-400">
            {formatPrice(ticker.lastPrice)}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-800/50 px-4 py-2">
          <div className="text-xs text-zinc-500">Best Bid</div>
          <div className="font-mono font-semibold">
            {formatPrice(ticker.bestBid)}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-800/50 px-4 py-2">
          <div className="text-xs text-zinc-500">Best Ask</div>
          <div className="font-mono font-semibold">
            {formatPrice(ticker.bestAsk)}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-800/50 px-4 py-2">
          <div className="text-xs text-zinc-500">Spread</div>
          <div className="font-mono font-semibold">
            {formatPrice(ticker.spread)}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>

          <span className="text-sm font-medium text-green-400">
            Connected
          </span>
        </div>

        <div>
          <div className="mb-1 text-xs text-zinc-500">
            Demo User
          </div>

          <select
            value={currentUser.username}
            onChange={(e) => {
              if (e.target.value === "buyer") {
                setCurrentUser({
                  id: BUYER_ID,
                  username: "buyer",
                });
              } else {
                setCurrentUser({
                  id: SELLER_ID,
                  username: "seller",
                });
              }
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
      </div>
    </header>
  );
}