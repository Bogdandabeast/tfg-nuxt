import { z } from "zod";

export const getSignupSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("signup.validation.name_required")),
  email: z.string().email(t("signup.validation.invalid_email")),
  password: z.string().min(8, t("signup.validation.password_min")),
});

export const getLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("login.validation.invalid_email")),
  password: z.string().min(8, t("login.validation.password_min")),
  remember: z.boolean().optional(),
});
