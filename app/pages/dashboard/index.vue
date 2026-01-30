<script setup lang="ts">
import type { Period, Range, Stat } from "~~/types/api";
import { storeToRefs } from "pinia";

import { FEATURE_ICONS, METRIC_ICONS } from "~/lib/icons";
import { useCompaniesStore } from "~/stores/companies";
import { useMetricsStore } from "~/stores/metrics";

definePageMeta({
  layout: "dashboard",
});

const metricsStore = useMetricsStore();
const companiesStore = useCompaniesStore();
const {
  totalRevenue,
  totalCustomers,
  newCustomers,
  averageTicket,
  topSellingProducts,
  salesByPeriod,
  totalSalesCount,
  loadingMetrics,
} = storeToRefs(metricsStore);

const period = ref<Period>("monthly");
const range = ref<Range>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date(),
});

const { t } = useI18n();
const toast = useToast();

const statsData = computed<Stat[]>(() => [
  {
    title: t("dashboard.metrics.customers"),
    icon: METRIC_ICONS.customers,
    value: totalCustomers.value ?? 0,
    variation: 12,
  },
  {
    title: t("dashboard.metrics.newCustomers"),
    icon: METRIC_ICONS.customerGrowth,
    value: newCustomers.value ?? 0,
    variation: 8,
  },
  {
    title: t("dashboard.metrics.revenue"),
    icon: METRIC_ICONS.revenue,
    value: totalRevenue.value ? `$${totalRevenue.value.toLocaleString()}` : 0,
    variation: -5,
  },
  {
    title: t("dashboard.metrics.averageTicket"),
    icon: METRIC_ICONS.averageTicket,
    value: averageTicket.value ? `$${averageTicket.value.toFixed(2)}` : 0,
    variation: 15,
  },
  {
    title: t("dashboard.metrics.topProduct"),
    icon: METRIC_ICONS.topProducts,
    value: topSellingProducts.value?.[0]?.name || "N/A",
    variation: 0,
  },
  {
    title: t("dashboard.metrics.totalSales"),
    icon: METRIC_ICONS.salesByPeriod,
    value: totalSalesCount.value || 0,
    variation: 0,
  },
]);

const allMetricsEmpty = computed(() => {
  if (!companiesStore.currentCompany?.id) {
    return true;
  }
  return (
    totalRevenue.value === 0
    && totalCustomers.value === 0
    && newCustomers.value === 0
    && averageTicket.value === 0
    && (!topSellingProducts.value || topSellingProducts.value.length === 0)
    && (!salesByPeriod.value || salesByPeriod.value.length === 0)
    && totalSalesCount.value === 0
  );
});

const isLoading = computed(() => loadingMetrics.value);

watch(() => companiesStore.currentCompany?.id, async (newCompanyId, oldCompanyId) => {
  if (newCompanyId && newCompanyId !== oldCompanyId) {
    try {
      const result = await metricsStore.loadAllMetrics();

      if (result && !result.success) {
        toast.add({
          title: t("common.error"),
          description: result.error || t("errors.metrics.load.description"),
          color: "error",
        });
      }
    }
    catch {
      toast.add({
        title: t("common.error"),
        description: t("errors.metrics.refresh.description"),
        color: "error",
      });
    }
  }
}, { immediate: false });
onMounted(() => {
  if (companiesStore.currentCompany?.id) {
    metricsStore.loadAllMetrics();
  }
});
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="m-5">
      <DashboardNavbar />
      <div v-if="allMetricsEmpty && !isLoading" class="text-center py-12">
        <UIcon :name="FEATURE_ICONS.analytics" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ t('dashboard.emptyMetrics.title') }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ t('dashboard.emptyMetrics.description') }}
        </p>
        <UButton
          to="/dashboard/customers"
          color="primary"
          size="lg"
        >
          {{ t('dashboard.emptyMetrics.cta') }}
        </UButton>
      </div>

      <DashboardMetricsInsights
        v-else
        :period="period"
        :range="range"
        :stats="statsData"
        :loading="isLoading"
      />
    </div>
  </UDashboardPanel>
</template>
