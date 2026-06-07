import { z } from "zod";

export const CreateOrderSchema = z.object({
  userId: z.string(),

  marketId: z.string(),

  side: z.enum(["BUY", "SELL"]),

  price: z.number().positive(),

  quantity: z.number().positive(),
});

export type CreateOrderInput =
  z.infer<typeof CreateOrderSchema>;