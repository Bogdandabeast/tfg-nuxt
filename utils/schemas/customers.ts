import { z } from "zod";

export const customerCreateSchema = z.object({
  name: z.string().trim().min(1, "validation.nameRequired"),
  email: z.string().trim().email("validation.invalidEmail"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  company_id: z.string().uuid(),
});

export const customerUpdateSchema = z.object({
  name: z.string().trim().min(1, "validation.nameRequired").optional(),
  email: z.string().trim().email("validation.invalidEmail").optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const customerIdParamSchema = z.object({
  id: z.string().uuid(),
});
