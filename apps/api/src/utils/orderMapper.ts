import { Order } from "@prisma/client";
import { EngineOrder } from "../../../engine/src/models/EngineOrder";

export function toEngineOrder(
  order: Order
): EngineOrder {
  return {
    id: order.id,

    userId: order.userId,

    marketId: order.marketId,

    side: order.side as "BUY" | "SELL",

    price: Number(order.price),

    quantity: Number(order.quantity),

    filledQuantity: Number(order.filledQuantity),

    status: order.status as
  | "PENDING"
  | "PARTIALLY_FILLED"
  | "FILLED",

    createdAt: order.createdAt,
  };
}