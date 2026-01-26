<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useAuthStore } from "~~/app/stores/auth";
import { FEATURE_ICONS } from "~/lib/icons";

import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();

useSeoMeta({
  title: t("login.seo.title"),
  description: t("login.seo.description"),
});

const authStore = useAuthStore();

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
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  /* const success =  */await authStore.signIn(
    payload.data.email,
    payload.data.password,
    payload.data.remember || false,
  );
  /* if (success) {
    window.location.reload()
  } */
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :title="t('login.form.title')"
    :icon="FEATURE_ICONS.password"
    :submit="{
      label: t('login.form.submit_button'),
      loading: authStore.isSigningIn,
    }"
    :disabled="authStore.isSigningIn"
    @submit="onSubmit"
  >
    <template #description>
      {{ t("login.form.no_account") }}
      <ULink :to="useLocalePath()(ROUTES.SIGNUP)" class="text-primary font-medium">
        {{ t("login.form.signup_link") }}
      </ULink>.
    </template>

    <template #password-hint>
      <ULink
        :to="useLocalePath()(ROUTES.HOME)"
        class="text-primary font-medium"
        tabindex="-1"
      >
        {{ t("login.form.forgot_password") }}
      </ULink>
    </template>

    <template #footer>
      {{ t("login.form.agree_terms_part1") }}
      <ULink
        :to="useLocalePath()(ROUTES.TERMS)"
        class="text-primary font-medium"
      >
        {{ t("login.form.terms_of_service_link") }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
