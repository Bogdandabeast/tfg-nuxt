import { z } from "zod";

export const createSaleSchema = z.object({
  customer_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  sale_date: z.string().datetime().optional(), // Optional as it defaults to defaultNow()
  company_id: z.number().int().positive(), // This will likely be set by middleware, but good for validation
});

export const updateSaleSchema = z.object({
  customer_id: z.number().int().positive().optional(),
  product_id: z.number().int().positive().optional(),
  quantity: z.number().int().positive().optional(),
  sale_date: z.string().datetime().optional(),
}).partial(); // All fields are optional for update

export const saleIdParamSchema = z.object({
  id: z.preprocess(val => Number(val), z.number().int().positive()),
});

export const customerIdParamSchema = z.object({
  customer_id: z.preprocess(val => Number(val), z.number().int().positive()),
});

export const productIdParamSchema = z.object({
  product_id: z.preprocess(val => Number(val), z.number().int().positive()),
});

export const companyIdParamSchema = z.object({
  company_id: z.preprocess(val => Number(val), z.number().int().positive()),
});
