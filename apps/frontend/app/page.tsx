export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="h-screen flex flex-col">

        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">
            Exchange Simulator
          </h1>

          <div className="font-semibold">
            BTC / USDT
          </div>
        </header>

        {/* Main */}
        <div className="flex flex-1">

          {/* Left */}
          <div className="w-80 border-r border-zinc-800 p-4">
            Order Book
          </div>

          {/* Center */}
          <div className="flex-1 flex flex-col">

            <div className="flex-1 border-b border-zinc-800 p-4">
              Trading Chart
            </div>

            <div className="h-64 p-4">
              Buy / Sell Panel
            </div>

          </div>

          {/* Right */}
          <div className="w-80 border-l border-zinc-800 p-4">
            Recent Trades
          </div>

        </div>

        {/* Bottom */}
        <div className="h-56 border-t border-zinc-800 p-4">
          Portfolio / Open Orders
        </div>

      </div>
    </main>
  );
}