import { z } from "zod";

export const periodSchema = z.enum(["daily", "weekly", "monthly"]);
export const dateRangeSchema = z.object({
  start: z.string().transform(str => new Date(str)),
  end: z.string().transform(str => new Date(str)),
});
export const limitSchema = z.coerce.number().min(1).max(100).default(10);

export const SalesByPeriodSchema = z.object({
  period: z.string(),
  totalSales: z.number(),
  totalRevenue: z.number(),
});

export const TopSellingProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalSold: z.number(),
});

export const SalesByPeriodArraySchema = z.array(SalesByPeriodSchema);
export const TopSellingProductArraySchema = z.array(TopSellingProductSchema);

export type SalesByPeriod = z.infer<typeof SalesByPeriodSchema>;
export type TopSellingProduct = z.infer<typeof TopSellingProductSchema>;
