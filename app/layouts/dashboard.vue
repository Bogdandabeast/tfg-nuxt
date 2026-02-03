<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import CompaniesMenu from "~/components/Dashboard/CompaniesMenu.vue";
import { NAVIGATION_ICONS } from "~/lib/icons";

import { ROUTES } from "~/utils/routes";

const { t } = useI18n();
const toast = useToast();
const localePath = useLocalePath();

const open = ref(false);

const authStore = useAuthStore();
await authStore.init();

const links = [
  [
    {
      label: t("navigation.home"),
      icon: NAVIGATION_ICONS.home,
      to: localePath(ROUTES.HOME),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.metrics"),
      icon: NAVIGATION_ICONS.dashboard,
      to: localePath(ROUTES.DASHBOARD),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.customers"),
      icon: NAVIGATION_ICONS.customers,
      to: localePath(ROUTES.CUSTOMERS),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.products"),
      icon: NAVIGATION_ICONS.products,
      to: localePath(ROUTES.PRODUCTS),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.sales"),
      icon: NAVIGATION_ICONS.sales,
      to: localePath(ROUTES.SALES),
      onSelect: () => {
        open.value = false;
      },
    },

  ],

] satisfies NavigationMenuItem[][];
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      open
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #default>
        <CompaniesMenu />

        <UNavigationMenu
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
