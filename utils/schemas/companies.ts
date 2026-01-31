import { z } from "zod";

export const companyCreateSchema = z.object({
  name: z.string().trim().min(1, "forms.companyForm.nameRequired"),
});

export const companyUpdateSchema = z.object({
  name: z.string().trim().min(1, "forms.companyForm.nameRequired").optional(),
});

export const companyIdParamSchema = z.object({
  id: z.string().trim().uuid(),
});
