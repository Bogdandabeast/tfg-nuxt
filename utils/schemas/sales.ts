import { z } from "zod";

export const createSaleSchema = z.object({
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").transform(val => new Date(val)),
  product_name: z.string().min(1),
  unit_price: z.number().positive(),
  customer_name: z.string().min(1),
  company_id: z.string().uuid(),
});

export const updateSaleSchema = z.object({
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").transform(val => new Date(val)),
}).partial(); // All fields are optional for update

export const saleIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const customerIdParamSchema = z.object({
  customer_id: z.string().uuid(),
  company_id: z.string().uuid(),
});

export const productIdParamSchema = z.object({
  product_id: z.string().uuid(),
  company_id: z.string().uuid(),
});

export const companyIdParamSchema = z.object({
  company_id: z.string().uuid(),
});
