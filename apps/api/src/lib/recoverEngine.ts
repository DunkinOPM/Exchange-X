import { prisma } from "./prisma";
import { matchingEngine } from "./matchingEngine";
import { toEngineOrder } from "../utils/orderMapper";

export async function recoverMatchingEngine() {
  console.log("Recovering matching engine...");

  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PENDING", "PARTIALLY_FILLED"],
      },
    },
    include: {
      market: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  for (const order of orders) {
    const engineOrder = toEngineOrder(order);
    engineOrder.marketSymbol = order.market.symbol;

    matchingEngine.submitOrder(engineOrder);
  }

  console.log(`Recovered ${orders.length} open orders.`);
}