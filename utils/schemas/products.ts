import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "validation.nameRequired"),
  description: z.string().trim().min(1, "validation.descriptionRequired"),
  price: z.coerce.number().positive("validation.pricePositive"),
  stock: z.coerce.number().int().min(0, "validation.stockNonNegative"),
  company_id: z.string().uuid(),
});

export const productUpdateSchema = z.object({
  name: z.string().trim().min(1, "validation.nameRequired").optional(),
  description: z.string().trim().min(1, "validation.descriptionRequired").optional(),
  price: z.coerce.number().positive("validation.pricePositive").optional(),
  stock: z.coerce.number().int().min(0, "validation.stockNonNegative").optional(),
});

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
});
