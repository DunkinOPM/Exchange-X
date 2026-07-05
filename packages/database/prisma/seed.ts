import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

import { PrismaClient } from "@prisma/client";

console.log(process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // Demo User
  // -----------------------------
  const user = await prisma.user.upsert({
    where: {
      email: "demo@exchange.com",
    },
    update: {},
    create: {
      email: "demo@exchange.com",
      username: "demo_user",
      passwordHash: "dummy_hash",
    },
  });

  console.log("User:", user);

  // -----------------------------
  // Markets
  // -----------------------------
  const markets = [
    {
      symbol: "BTCUSDT",
      baseAssetSymbol: "BTC",
      quoteAssetSymbol: "USDT",
    },
    {
      symbol: "ETHUSDT",
      baseAssetSymbol: "ETH",
      quoteAssetSymbol: "USDT",
    },
    {
      symbol: "SOLUSDT",
      baseAssetSymbol: "SOL",
      quoteAssetSymbol: "USDT",
    },
    {
      symbol: "BNBUSDT",
      baseAssetSymbol: "BNB",
      quoteAssetSymbol: "USDT",
    },
    {
      symbol: "ADAUSDT",
      baseAssetSymbol: "ADA",
      quoteAssetSymbol: "USDT",
    },
    {
      symbol: "DOGEUSDT",
      baseAssetSymbol: "DOGE",
      quoteAssetSymbol: "USDT",
    },
  ];

  console.log("\nSeeding Markets...\n");

  for (const market of markets) {
    const createdMarket = await prisma.market.upsert({
      where: {
        symbol: market.symbol,
      },
      update: {},
      create: market,
    });

    console.log(`✓ ${createdMarket.symbol}`);
  }

  console.log("\nDatabase seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });