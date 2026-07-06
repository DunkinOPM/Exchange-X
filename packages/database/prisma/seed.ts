import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

import { PrismaClient } from "@prisma/client";

console.log(process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // Demo Users
  // -----------------------------
  const buyer = await prisma.user.upsert({
    where: {
      email: "buyer@exchange.com",
    },
    update: {},
    create: {
      email: "buyer@exchange.com",
      username: "buyer",
      passwordHash: "dummy_hash",
    },
  });

  const seller = await prisma.user.upsert({
    where: {
      email: "seller@exchange.com",
    },
    update: {},
    create: {
      email: "seller@exchange.com",
      username: "seller",
      passwordHash: "dummy_hash",
    },
  });

  console.log("Buyer:", buyer.id);
  console.log("Seller:", seller.id);

  // -----------------------------
  // Buyer Balances
  // -----------------------------
  console.log("\nSeeding Buyer Balances...\n");

  await prisma.balance.upsert({
    where: {
      userId_asset: {
        userId: buyer.id,
        asset: "USDT",
      },
    },
    update: {
      available: 100000,
      locked: 0,
    },
    create: {
      userId: buyer.id,
      asset: "USDT",
      available: 100000,
      locked: 0,
    },
  });

  console.log("✓ Buyer USDT");

  // -----------------------------
  // Seller Balances
  // -----------------------------
  console.log("\nSeeding Seller Balances...\n");

  const sellerBalances = [
    {
      asset: "BTC",
      available: 10,
    },
    {
      asset: "ETH",
      available: 100,
    },
    {
      asset: "SOL",
      available: 1000,
    },
    {
      asset: "BNB",
      available: 100,
    },
    {
      asset: "ADA",
      available: 50000,
    },
    {
      asset: "DOGE",
      available: 100000,
    },
  ];

  for (const balance of sellerBalances) {
    await prisma.balance.upsert({
      where: {
        userId_asset: {
          userId: seller.id,
          asset: balance.asset,
        },
      },
      update: {
        available: balance.available,
        locked: 0,
      },
      create: {
        userId: seller.id,
        asset: balance.asset,
        available: balance.available,
        locked: 0,
      },
    });

    console.log(`✓ Seller ${balance.asset}`);
  }

  // -----------------------------
  // Markets
  // -----------------------------
  console.log("\nSeeding Markets...\n");

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

  console.log("\n✅ Database seeded successfully!");
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