"use client";

import { useRouter } from "next/navigation";

import { useMarketStore } from "../../store/marketStore";
import { useTickerStore } from "../../store/tickerStore";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const router = useRouter();

  const market = useMarketStore((s) => s.selectedMarket);
  const setMarket = useMarketStore((s) => s.setMarket);

  const ticker = useTickerStore((s) => s.ticker);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const formatPrice = (
    value: number | null | undefined,
  ) => {
    if (value == null) return "--";

    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold">
          ExchangeX
        </h1>

        <select
          value={market}
          onChange={(e) =>
            setMarket(e.target.value)
          }
          className="rounded bg-zinc-800 px-3 py-2"
        >
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="SOLUSDT">SOLUSDT</option>
          <option value="BNBUSDT">BNBUSDT</option>
          <option value="ADAUSDT">ADAUSDT</option>
          <option value="DOGEUSDT">DOGEUSDT</option>
        </select>
      </div>

      <div className="flex gap-8 text-sm">
        <div>
          <div className="text-zinc-500">Last</div>
          <div className="font-bold text-green-400">
            {formatPrice(ticker.lastPrice)}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">Bid</div>
          <div>{formatPrice(ticker.bestBid)}</div>
        </div>

        <div>
          <div className="text-zinc-500">Ask</div>
          <div>{formatPrice(ticker.bestAsk)}</div>
        </div>

        <div>
          <div className="text-zinc-500">Spread</div>
          <div>{formatPrice(ticker.spread)}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>

          <span className="text-zinc-400">
            Connected
          </span>
        </div>

        <div className="rounded bg-zinc-800 px-3 py-2">
          👤 {user?.username ?? "Guest"}
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="rounded bg-red-600 px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}