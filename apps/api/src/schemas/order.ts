import { z } from "zod";

export const CreateOrderSchema = z.object({
  userId: z.string(),

  marketId: z.string(),

  side: z.enum(["BUY", "SELL"]),

  type: z.enum(["LIMIT", "MARKET"]),

  price: z.number().positive().optional(),

  quantity: z.number().positive(),
});

export type CreateOrderInput =
  z.infer<typeof CreateOrderSchema>;