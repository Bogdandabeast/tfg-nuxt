import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  company_id: z.string().uuid(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
});

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
});
