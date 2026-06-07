import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

import { PrismaClient } from "@prisma/client";


console.log(process.env.DATABASE_URL);
const prisma = new PrismaClient();

async function main() {
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

  const market = await prisma.market.upsert({
    where: {
      symbol: "BTCUSDT",
    },
    update: {},
    create: {
      symbol: "BTCUSDT",
      baseAssetSymbol: "BTC",
      quoteAssetSymbol: "USDT",
    },
  });

  console.log("User:", user);
  console.log("Market:", market);
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