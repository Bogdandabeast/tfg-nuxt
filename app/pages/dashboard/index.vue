<script setup lang="ts">
import type { Period, Range, Stat } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const period = ref<Period>("month");
const range = ref<Range>([
  new Date(2024, 0, 1),
  new Date(),
]);

const isNotificationsSlideoverOpen = ref(false);

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const baseStats = [
  {
    title: "Customers",
    icon: "i-lucide-users",
    minValue: 400,
    maxValue: 1000,
    minVariation: -15,
    maxVariation: 25,
    to: "/dashboard/customers",
  },
  {
    title: "Conversions",
    icon: "i-lucide-chart-pie",
    minValue: 1000,
    maxValue: 2000,
    minVariation: -10,
    maxVariation: 20,
    to: "/dashboard/customers",
  },
  {
    title: "Revenue",
    icon: "i-lucide-circle-dollar-sign",
    minValue: 200000,
    maxValue: 500000,
    minVariation: -20,
    maxVariation: 30,
    formatter: formatCurrency,
    to: "/dashboard/sales",
  },
  {
    title: "Orders",
    icon: "i-lucide-shopping-cart",
    minValue: 100,
    maxValue: 300,
    minVariation: -5,
    maxVariation: 15,
    to: "/dashboard/sales",
  },
  {
    title: "Products",
    icon: "i-lucide-boxes",
    minValue: 50,
    maxValue: 200,
    minVariation: -8,
    maxVariation: 18,
    to: "/dashboard/products",
  },
  {
    title: "Companies",
    icon: "i-lucide-building-office",
    minValue: 5,
    maxValue: 25,
    minVariation: -12,
    maxVariation: 22,
    to: "/dashboard/companies",
  },
];

const { data: stats } = await useAsyncData<Stat[]>("stats", async () => {
  return baseStats.map((stat) => {
    const value = Math.floor(Math.random() * (stat.maxValue - stat.minValue + 1)) + stat.minValue;
    const variation = Math.floor(Math.random() * (stat.maxVariation - stat.minVariation + 1)) + stat.minVariation;

    return {
      title: stat.title,
      icon: stat.icon,
      value: stat.formatter ? stat.formatter(value) : value,
      variation,
      to: stat.to,
    };
  });
}, {
  watch: [() => period.value, () => range.value],
  default: () => [],
});
</script>

<template>
  <UDashboardPanel id="dashboard-home">
    <template #header>
      <UDashboardNavbar title="Dashboard" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-heroicons-bell-20-solid" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu
            :items="[
              [
                {
                  label: 'Add Company',
                  icon: 'i-heroicons-plus-20-solid',
                  click: () => console.log('Add Company'),
                },
                {
                  label: 'Import Data',
                  icon: 'i-heroicons-arrow-up-tray-20-solid',
                  click: () => console.log('Import Data'),
                },
              ],
              [
                {
                  label: 'Export Report',
                  icon: 'i-heroicons-arrow-down-tray-20-solid',
                  click: () => console.log('Export Report'),
                },
              ],
            ]"
          >
            <UButton
              icon="i-heroicons-plus-20-solid"
              size="md"
              class="rounded-full"
            />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UBreadcrumb
          :items="[
            { label: 'Dashboard' },
          ]"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
        <UPageCard
          v-for="(stat, index) in stats"
          :key="index"
          :icon="stat.icon"
          :title="stat.title"
          :to="stat.to"
          variant="subtle"
          :ui="{
            container: 'gap-y-1.5',
            wrapper: 'items-start',
            leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
            title: 'font-normal text-muted text-xs uppercase',
          }"
          class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
        >
          <div class="flex items-center gap-2">
            <span class="text-2xl font-semibold text-highlighted">
              {{ stat.value }}
            </span>

            <UBadge
              :color="stat.variation > 0 ? 'success' : 'error'"
              variant="subtle"
              class="text-xs"
            >
              {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
            </UBadge>
          </div>
        </UPageCard>
      </UPageGrid>

      <div class="mt-8 grid lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Recent Activity
            </h3>
          </template>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-plus-circle-20-solid" class="h-5 w-5 text-green-500" />
              <div>
                <p class="text-sm font-medium">
                  New customer registered
                </p>
                <p class="text-xs text-gray-500">
                  2 hours ago
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-shopping-bag-20-solid" class="h-5 w-5 text-blue-500" />
              <div>
                <p class="text-sm font-medium">
                  Sale completed
                </p>
                <p class="text-xs text-gray-500">
                  4 hours ago
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-cube-20-solid" class="h-5 w-5 text-purple-500" />
              <div>
                <p class="text-sm font-medium">
                  Product added to inventory
                </p>
                <p class="text-xs text-gray-500">
                  6 hours ago
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Quick Actions
            </h3>
          </template>
          <div class="grid grid-cols-2 gap-3">
            <UButton
              icon="i-heroicons-plus-20-solid"
              size="lg"
              block
              variant="outline"
            >
              Add Customer
            </UButton>
            <UButton
              icon="i-heroicons-shopping-cart-20-solid"
              size="lg"
              block
              variant="outline"
            >
              New Sale
            </UButton>
            <UButton
              icon="i-heroicons-cube-20-solid"
              size="lg"
              block
              variant="outline"
            >
              Add Product
            </UButton>
            <UButton
              icon="i-heroicons-building-office-20-solid"
              size="lg"
              block
              variant="outline"
            >
              New Company
            </UButton>
          </div>
        </UCard>
      </div>
    </template>

    <NotificationsSlideover v-model="isNotificationsSlideoverOpen" />
  </UDashboardPanel>
</template>
