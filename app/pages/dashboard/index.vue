<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Period, Range, Stat } from "~/types";
import { useMetricsStore } from "~/stores/metrics";

definePageMeta({
  layout: "dashboard",
});

const metricsStore = useMetricsStore();
const {
  totalRevenue,
  totalCustomers,
  newCustomers,
  averageTicket,
  topSellingProducts,
  totalSalesCount,
  loadingRevenue,
  loadingCustomers,
  loadingNewCustomers,
  loadingAverageTicket,
  loadingTopProducts,
  loadingSalesByPeriod,
} = storeToRefs(metricsStore);

const period = ref<Period>("monthly");
const range = ref<Range>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});

const { t } = useI18n();

const statsData = computed<Stat[]>(() => [
  {
    title: t('dashboard.metrics.customers'),
    icon: "i-lucide-users",
    value: totalCustomers.value ?? 0,
    variation: 12,
  },
  {
    title: t('dashboard.metrics.newCustomers'),
    icon: "i-lucide-user-plus",
    value: newCustomers.value ?? 0,
    variation: 8,
  },
  {
    title: t('dashboard.metrics.revenue'),
    icon: "i-lucide-circle-dollar-sign",
    value: totalRevenue.value ? `$${totalRevenue.value.toLocaleString()}` : 0,
    variation: -5,
  },
  {
    title: t('dashboard.metrics.averageTicket'),
    icon: "i-lucide-receipt",
    value: averageTicket.value ? `$${averageTicket.value.toFixed(2)}` : 0,
    variation: 15,
  },
  {
    title: t('dashboard.metrics.topProduct'),
    icon: "i-lucide-trending-up",
    value: topSellingProducts.value?.[0]?.name || 'N/A',
    variation: 0,
  },
  {
    title: t('dashboard.metrics.totalSales'),
    icon: "i-lucide-bar-chart",
    value: totalSalesCount.value || 0,
    variation: 0,
  },
]);

const isLoading = computed(() =>
  loadingRevenue.value ||
  loadingCustomers.value ||
  loadingNewCustomers.value ||
  loadingAverageTicket.value ||
  loadingTopProducts.value ||
  loadingSalesByPeriod.value
);

// Initialize defaults automatically through reactivity
// The store will load data when dateRange is set
</script>

<template>
  <UContainer class="py-8">
    <DashboardMetricsInsights
      :period="period"
      :range="range"
      :stats="statsData"
      :loading="isLoading"
    />
  </UContainer>
</template>
