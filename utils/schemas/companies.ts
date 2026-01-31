import { z } from "zod";

export const companyCreateSchema = z.object({
  name: z.string().trim().min(1, "forms.companyForm.nameRequired"),
});

export const companyUpdateSchema = z.object({
  name: z.string().min(1, "Company name is required").optional(),
});

export const companyIdParamSchema = z.object({
  id: z.string().trim().uuid(),
});
