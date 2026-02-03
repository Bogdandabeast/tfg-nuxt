<script setup lang="ts">
import { NAVIGATION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

const { t } = useI18n();
const route = useRoute();

const items = computed(() => [
  {
    label: t("header.crm"),
    to: useLocalePath()(ROUTES.DASHBOARD),
    active: route.path.startsWith(useLocalePath()(ROUTES.DASHBOARD)),
  },
  {
    label: t("header.pricing"),
    to: useLocalePath()(ROUTES.PRICING),
  },
  {
    label: t("header.legal"),
    to: useLocalePath()(ROUTES.TERMS),
  },
]);
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink :to="useLocalePath()(ROUTES.HOME)">
        <LandingAppLogo class="w-auto h-6 py-4 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UButton
        :icon="NAVIGATION_ICONS.signIn"
        color="neutral"
        variant="ghost"
        :to="useLocalePath()(ROUTES.LOGIN)"
        class="lg:hidden"
      />

      <LandingLocaleSelector />
      <UColorModeSwitch />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        :label="$t('header.signIn')"
        color="neutral"
        variant="subtle"
        :to="useLocalePath()(ROUTES.LOGIN)"
        block
        class="mb-3"
      />

      <UButton
        :label="$t('header.signUp')"
        color="neutral"
        :to="useLocalePath()(ROUTES.SIGNUP)"
        block
      />
    </template>
  </UHeader>
</template>
