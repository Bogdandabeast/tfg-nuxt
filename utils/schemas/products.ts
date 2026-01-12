import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().refine((val) => {
    const num = Number(val);
    return !Number.isNaN(num) && num > 0;
  }, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  company_id: z.number().int(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.string().refine((val) => {
    const num = Number(val);
    return !Number.isNaN(num) && num > 0;
  }, "Price must be a positive number").optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
});

export const productIdParamSchema = z.object({
  id: z.preprocess(val => Number(val), z.number().int().positive()),
});
