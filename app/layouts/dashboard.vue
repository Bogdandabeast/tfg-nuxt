<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";

import { ROUTES } from "~~/lib/constants";

const { t } = useI18n();
const toast = useToast();
const localePath = useLocalePath();

const open = ref(false);

// Auth initialization for layout components
const authStore = useAuthStore();
await authStore.init();

const links = [
  [
    {
      label: t("navigation.home"),
      icon: "lucide:house",
      to: localePath("/"),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.customers"),
      icon: "lucide:users",
      to: localePath(ROUTES.dashboardCustomers),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.products"),
      icon: "lucide:boxes",
      to: localePath(ROUTES.dashboardProducts),
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: t("navigation.sales"),
      icon: "lucide:dollar-sign",
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
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
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

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
