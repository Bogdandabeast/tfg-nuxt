<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

import { ROUTES } from "~~/lib/constants";

const toast = useToast();
const route = useRoute();

// stores

const companiesStore = useCompaniesStore();
const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

const open = ref(false);

const authStore = useAuthStore();
await authStore.init();

// logic for refetching data ssr friendly

if (route.path.includes(ROUTES.dashboard)) {
  try {
    await companiesStore.refreshCompanies();
  }
  catch {
    toast.add({ title: "Error", description: "Failed to refresh companies data", color: "error" });
  }
}

if (route.path.includes(ROUTES.dashboardCustomers)) {
  try {
    await customersStore.refreshCustomers();
  }
  catch {
    toast.add({ title: "Error", description: "Failed to refresh customers data", color: "error" });
  }
}

if (route.path.includes(ROUTES.dashboardProducts)) {
  try {
    await productsStore.refreshProducts();
  }
  catch {
    toast.add({ title: "Error", description: "Failed to refresh products data", color: "error" });
  }
}

if (route.path.includes(ROUTES.dashboardSales)) {
  const results = await Promise.allSettled([
    customersStore.refreshCustomers(),
    productsStore.refreshProducts(),
    salesStore.refreshSales(),
  ]);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const resource = ["customers", "products", "sales"][index];
      toast.add({ title: "Error", description: `Failed to refresh ${resource} data`, color: "error" });
    }
  });
}

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
    {
      label: "Settings",
      to: `${ROUTES.dashboard}/settings`,
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "General",
          to: `${ROUTES.dashboard}/settings`,
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Members",
          to: `${ROUTES.dashboard}/settings/members`,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Notifications",
          to: `${ROUTES.dashboard}/settings/notifications`,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Security",
          to: `${ROUTES.dashboard}/settings/security`,
          onSelect: () => {
            open.value = false;
          },
        },
      ],
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

      <template #footer="{ collapsed }">
        <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />
    <slot />
  </UDashboardGroup>
</template>
