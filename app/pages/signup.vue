<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useAuthStore } from '~/app/stores/auth';

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Sign up",
  description: "Create an account to get started",
});

const authStore = useAuthStore();
const toast = useToast();

const fields = [{
  name: "name",
  type: "text" as const,
  label: "Name",
  placeholder: "Enter your name",
}, {
  name: "email",
  type: "text" as const,
  label: "Email",
  placeholder: "Enter your email",
}, {
  name: "password",
  label: "Password",
  type: "password" as const,
  placeholder: "Enter your password",
}];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  await authStore.signUp({
    name: payload.data.name,
    email: payload.data.email,
    password: payload.data.password,
  });
  if (authStore.loggedIn) {
    toast.add({ title: "Success", description: "Account created successfully", color: "green" });
  } else {
    toast.add({ title: "Error", description: "Could not create account", color: "red" });
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    title="Create an account"
    :submit="{ label: 'Create account' }"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account? <ULink
        to="/login"
        class="text-primary font-medium"
      >
        Login
      </ULink>.
    </template>

    <template #footer>
      By signing up, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
      >
        Terms of Service
      </ULink>.
    </template>
  </UAuthForm>
</template>
