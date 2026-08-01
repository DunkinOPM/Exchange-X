interface Props {
  balance: {
    asset: string;
    available: number;
    locked: number;
  };
}

function getIcon(asset: string) {
  switch (asset) {
    case "BTC":
      return "₿";
    case "ETH":
      return "Ξ";
    case "SOL":
      return "◎";
    case "BNB":
      return "🟡";
    case "ADA":
      return "♦";
    case "DOGE":
      return "🐶";
    case "USDT":
      return "💵";
    default:
      return "🪙";
  }
}

function getColor(asset: string) {
  switch (asset) {
    case "BTC":
      return "bg-orange-500/20 text-orange-400";
    case "ETH":
      return "bg-indigo-500/20 text-indigo-400";
    case "SOL":
      return "bg-purple-500/20 text-purple-400";
    case "BNB":
      return "bg-yellow-500/20 text-yellow-400";
    case "ADA":
      return "bg-blue-500/20 text-blue-400";
    case "DOGE":
      return "bg-amber-500/20 text-amber-400";
    case "USDT":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-zinc-700 text-white";
  }
}

export default function AssetCard({ balance }: Props) {
  const total = balance.available + balance.locked;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-2xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${getColor(balance.asset)}`}
          >
            {getIcon(balance.asset)}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {balance.asset}
            </h2>

            <p className="text-sm text-zinc-500">
              Digital Asset
            </p>
          </div>

        </div>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
          Active
        </span>

      </div>

      {/* Body */}
      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Available
          </span>

          <span className="font-medium">
            {balance.available.toFixed(8)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Locked
          </span>

          <span className="font-medium">
            {balance.locked.toFixed(8)}
          </span>
        </div>

        <hr className="border-zinc-800" />

        <div className="flex justify-between text-lg font-bold">

          <span>Total</span>

          <span className="text-green-400">
            {total.toFixed(8)}
          </span>

        </div>

      </div>

    </div>
  );
}