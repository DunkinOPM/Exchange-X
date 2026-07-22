"use client";

import { useMarketStore } from "../../store/marketStore";
import { useTickerStore } from "../../store/tickerStore";
import { useUserStore } from "../../store/userStore";

const BUYER_ID = "cmr962oji0000qohcbkzvige6";
const SELLER_ID = "cmr962okc0001qohcpbanm17v";

export default function Header() {
  const market = useMarketStore((s) => s.selectedMarket);
  const setMarket = useMarketStore((s) => s.setMarket);

  const ticker = useTickerStore((s) => s.ticker);

  const currentUser = useUserStore((s) => s.currentUser);
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-6">

        <h1 className="text-2xl font-bold tracking-wide">
          Exchange Simulator
        </h1>

        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="rounded bg-zinc-800 px-3 py-2 outline-none"
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
      <div className="flex items-center gap-10 text-sm">

        <div>
          <div className="text-zinc-500">Last</div>
          <div className="font-bold text-green-400">
            {ticker.lastPrice?.toLocaleString() ?? "--"}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">Best Bid</div>
          <div>
            {ticker.bestBid?.toLocaleString() ?? "--"}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">Best Ask</div>
          <div>
            {ticker.bestAsk?.toLocaleString() ?? "--"}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">Spread</div>
          <div>
            {ticker.spread?.toLocaleString() ?? "--"}
          </div>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-zinc-400">
            Connected
          </span>
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
          className="rounded bg-zinc-800 px-3 py-2 outline-none"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

      </div>

    </header>
  );
}