import { z } from "zod";

export const createSaleSchema = z.object({
  customer_id: z.string().trim().uuid("validation.invalidCustomer"),
  product_id: z.string().trim().uuid("validation.invalidProduct"),
  quantity: z.number().int().positive("validation.quantityPositive"),
  sale_date: z.string().trim().date("validation.invalidDate").transform(val => new Date(val)),
  product_name: z.string().trim().min(1),
  unit_price: z.number().positive(),
  customer_name: z.string().trim().min(1),
  company_id: z.string().uuid(),
  discount: z.number().nonnegative("validation.discountNonNegative").optional(),
  tax_rate: z.number().nonnegative("validation.taxRateNonNegative").max(1, "validation.taxRateMax1").optional(),
});

export const updateSaleSchema = z.object({
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  sale_date: z.string().date().transform(val => new Date(val)),
  discount: z.number().nonnegative("validation.discountNonNegative").optional(),
  tax_rate: z.number().nonnegative("validation.taxRateNonNegative").max(1, "validation.taxRateMax1").optional(),
}).partial();

export const saleIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const customerWithCompanyIdParamSchema = z.object({
  customer_id: z.string().uuid(),
  company_id: z.string().uuid(),
});

export const productWithCompanyIdParamSchema = z.object({
  product_id: z.string().uuid(),
  company_id: z.string().uuid(),
});

export const companyIdParamSchema = z.object({
  company_id: z.string().uuid(),
});
