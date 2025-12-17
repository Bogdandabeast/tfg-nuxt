<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();

const items = computed(() => [
  {
    label: t("header.crm"),
    to: "/dashboard",
    active: route.path.startsWith("/dashboard"),
  },
  {
    label: t("header.pricing"),
    to: "/pricing",
  },

  {
    label: t("header.changelog"),
    to: "/changelog",
  },
]);
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <LandingAppLogo class="w-auto h-6 py-4 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        to="/login"
        class="lg:hidden"
      />

      <UButton
        :label="$t('header.signIn')"
        color="neutral"
        variant="outline"
        to="/login"
        class="hidden lg:inline-flex"
      />

      <UButton
        :label="$t('header.signUp')"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex"
        to="/signup"
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
        to="/login"
        block
        class="mb-3"
      />

      <UButton
        :label="$t('header.signUp')"
        color="neutral"
        to="/signup"
        block
      />
    </template>
  </UHeader>
</template>
