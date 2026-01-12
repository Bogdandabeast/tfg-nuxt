import { z } from "zod";

export const customerCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  company_id: z.number().int(),
});

export const customerUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const customerIdParamSchema = z.object({
  id: z.preprocess(val => Number(val), z.number().int().positive()),
});
