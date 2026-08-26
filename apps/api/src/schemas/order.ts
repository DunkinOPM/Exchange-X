import { z } from "zod";

export const CreateOrderSchema = z.object({
  market: z.string(),

  side: z.enum(["BUY", "SELL"]),

  type: z.enum(["LIMIT", "MARKET"]),

  price: z.number().optional(),

  quantity: z.number(),
});

export type CreateOrderInput =
  z.infer<typeof CreateOrderSchema>;