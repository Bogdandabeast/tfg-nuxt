import { z } from "zod";

export const customerCreateSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  email: z.string().email("validation.invalidEmail"),
  phone: z.string().optional(),
  address: z.string().optional(),
  company_id: z.string().uuid(),
});

export const customerUpdateSchema = z.object({
  name: z.string().min(1, "validation.nameRequired").optional(),
  email: z.string().email("validation.invalidEmail").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const customerIdParamSchema = z.object({
  id: z.string().uuid(),
});
