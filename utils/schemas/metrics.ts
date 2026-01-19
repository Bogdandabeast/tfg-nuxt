import { z } from "zod";

export const periodSchema = z.enum(['daily', 'weekly', 'monthly']);
export const dateRangeSchema = z.object({
  start: z.string().transform(str => new Date(str)),
  end: z.string().transform(str => new Date(str))
});
export const limitSchema = z.coerce.number().min(1).max(100).default(10);