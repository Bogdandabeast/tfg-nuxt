<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useAuthStore } from "~/app/stores/auth";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();

useSeoMeta({
  title: t("login.seo.title"),
  description: t("login.seo.description"),
});

const authStore = useAuthStore();
const toast = useToast();

const fields = [
  {
    name: "email",
    type: "text" as const,
    label: t("login.form.email.label"),
    placeholder: t("login.form.email.placeholder"),
    required: true,
  },
  {
    name: "password",
    label: t("login.form.password.label"),
    type: "password" as const,
    placeholder: t("login.form.password.placeholder"),
  },
  {
    name: "remember",
    label: t("login.form.remember_me.label"),
    type: "checkbox" as const,
  },
];

const schema = z.object({
  email: z.string().email(t("login.validation.invalid_email")),
  password: z.string().min(8, t("login.validation.password_min")),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  await authStore.signIn({
    email: payload.data.email,
    password: payload.data.password,
  });
  if (!authStore.loggedIn) {
    toast.add({ title: t("login.toast.error.title"), description: t("login.toast.error.description"), color: "primary" });
  }
  else {
    toast.add({ title: t("login.toast.success.title"), description: t("login.toast.success.description"), color: "green" });
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :title="t('login.form.title')"
    icon="i-lucide-lock"
    @submit="onSubmit"
  >
    <template #description>
      {{ t("login.form.no_account") }}
      <ULink to="/signup" class="text-primary font-medium">
        {{ t("login.form.signup_link") }}
      </ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >
        {{ t("login.form.forgot_password") }}
      </ULink>
    </template>

    <template #footer>
      {{ t("login.form.agree_terms_part1") }}
      <ULink
        to="/terms"
        class="text-primary font-medium"
      >
        {{ t("login.form.terms_of_service_link") }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
