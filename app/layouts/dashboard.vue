<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import { ROUTES } from "~~/lib/constants";
import { NAVIGATION_ICONS } from "~/lib/icons";

import CompaniesMenu from "~/components/Dashboard/CompaniesMenu.vue";

const { t } = useI18n();
const toast = useToast();
const localePath = useLocalePath();
const breadcrumps = useBreadcrumbs();

const open = ref(false);

// Auth initialization for layout components
const authStore = useAuthStore();
await authStore.init();

const links = [
  [
    {
      label: t("navigation.home"),
      icon: NAVIGATION_ICONS.home,
      to: localePath(ROUTES.home),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.metrics"),
      icon: NAVIGATION_ICONS.dashboard,
      to: localePath(ROUTES.dashboard),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.customers"),
      icon: NAVIGATION_ICONS.customers,
      to: localePath(ROUTES.dashboardCustomers),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.products"),
      icon: NAVIGATION_ICONS.products,
      to: localePath(ROUTES.dashboardProducts),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.sales"),
      icon: NAVIGATION_ICONS.sales,
      to: localePath(ROUTES.dashboardSales),
      onSelect: () => {
        open.value = false;
      },
    },

  ],

] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: t("navigation.goTo"),
    items: links.flat(),
  },
]);

onMounted(async () => {
  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") {
    return;
  }

  toast.add({
    title: t("cookieConsent.message"),
    duration: 0,
    close: false,
    actions: [
      {
        label: t("cookieConsent.accept"),
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
      {
        label: t("cookieConsent.optOut"),
        color: "neutral",
        variant: "ghost",
      },
    ],
  });
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      mode="drawer"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <CompaniesMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
        <DashboardSignOut />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
