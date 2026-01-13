<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

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

const dashboard = "/dashboard";
const dashboardCustomers = "/dashboard/customers";
const dashboardProducts = "/dashboard/products";
const dashboardSales = "/dashboard/sales";

if (dashboard.includes(route.name?.toString() || "")) {
  await companiesStore.refreshCompanies();
}
if (dashboardCustomers.includes(route.name?.toString() || "")) {
  await customersStore.refreshCustomers();
}

if (dashboardProducts.includes(route.name?.toString() || "")) {
  await productsStore.refreshProducts();
}

if (dashboardSales.includes(route.name?.toString() || "")) {
  await customersStore.refreshCustomers();
  await productsStore.refreshProducts();
  await salesStore.refreshSales();
}

/* onMounted(() => {
  salesStore.refreshSales();
  customersStore.refreshCustomers();
  productsStore.refreshProducts();
}); */

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
      to: "/dashboard/customers",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Products",
      icon: "lucide:boxes",
      to: "/dashboard/products",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Sales",
      icon: "lucide:dollar-sign",
      to: "/dashboard/sales",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Settings",
      to: "/dashboard/settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "General",
          to: "/dashboard/settings",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Members",
          to: "/dashboard/settings/members",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Notifications",
          to: "/dashboard/settings/notifications",
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: "Security",
          to: "/dashboard/settings/security",
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
