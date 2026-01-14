<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

import { ROUTES } from "~~/lib/constants";

const toast = useToast();

const open = ref(false);

// Auth initialization for layout components
const authStore = useAuthStore();
await authStore.init();

const links = [
  [
    {
      label: "Home",
      icon: "lucide:house",
      to: "/",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Customers",
      icon: "lucide:users",
      to: ROUTES.dashboardCustomers,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Products",
      icon: "lucide:boxes",
      to: ROUTES.dashboardProducts,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Sales",
      icon: "lucide:dollar-sign",
      to: ROUTES.dashboardSales,
      onSelect: () => {
        open.value = false;
      },
    },

  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
]);

onMounted(async () => {
  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") {
    return;
  }

  toast.add({
    title: "We use first-party cookies to enhance your experience on our website.",
    duration: 0,
    close: false,
    actions: [
      {
        label: "Accept",
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
      {
        label: "Opt out",
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
        <DashboardCompaniesMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
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

      <template #footer>
        <!-- Footer content can be added here if needed -->
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />
    <slot />
  </UDashboardGroup>
</template>
