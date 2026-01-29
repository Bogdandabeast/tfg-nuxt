<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useAuthStore } from "~~/app/stores/auth";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();

const success = ref(false);

useSeoMeta({
  title: t("signup.seo.title"),
  description: t("signup.seo.description"),
});

const authStore = useAuthStore();

const fields = [{
  name: "name",
  type: "text" as const,
  label: t("signup.form.name.label"),
  placeholder: t("signup.form.name.placeholder"),
}, {
  name: "email",
  type: "text" as const,
  label: t("signup.form.email.label"),
  placeholder: t("signup.form.email.placeholder"),
}, {
  name: "password",
  label: t("signup.form.password.label"),
  type: "password" as const,
  placeholder: t("signup.form.password.placeholder"),
}];

const schema = z.object({
  name: z.string().min(1, t("signup.validation.name_required")),
  email: z.string().email(t("signup.validation.invalid_email")),
  password: z.string().min(8, t("signup.validation.password_min")),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const success.value = await authStore.signUp(payload.data.name, payload.data.email, payload.data.password);

}
</script>

<template>
  <UAuthForm
    v-if="success"
    :fields="fields"
    :schema="schema"
    :title="t('signup.form.title')"
    :submit="{
      label: t('signup.form.submit_button'),
      loading: authStore.isSigningUp,
    }"
    :disabled="authStore.isSigningUp"
    @submit="onSubmit"
  >
    <template #description>
      {{ t("signup.form.has_account") }}       <ULink
        :to="useLocalePath()(ROUTES.LOGIN)"
        class="text-primary font-medium"
      >
        {{ t("signup.form.login_link") }}
      </ULink>.
    </template>

    <template #footer>
      {{ t("signup.form.agree_terms_part1") }}       <ULink
        :to="useLocalePath()(ROUTES.TERMS)"
        class="text-primary font-medium"
      >
        {{ t("signup.form.terms_of_service_link") }}
      </ULink>.
    </template>
  </UAuthForm>
  <UCard v-else variant="subtle">
    <template #header>
      <h1 class="text-center">
        {{ t("signup.card.verify_email.title") }}
      </h1>
    </template>
    {{ t("signup.card.verify_email.description") }}
    <template #footer>
      <div class="flex flex-col items-center gap-4">
        <UButton
          class="flex-1"
          :label="t('signup.card.verify_email.resend_button')"
          color="secondary"
          variant="subtle"
        />
        <DashboardSignOut />
      </div>
    </template>
  </UCard>
</template>
