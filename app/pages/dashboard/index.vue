<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Period, Range, Stat } from "~/types";
import { useMetricsStore } from "~/stores/metrics";
import { useCompaniesStore } from "~/stores/companies";

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
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});

const { t } = useI18n();
const toast = useToast();

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

// Detectar si todas las métricas están vacías
const allMetricsEmpty = computed(() => {
  return (
    (totalRevenue.value === null || totalRevenue.value === 0) &&
    (totalCustomers.value === null || totalCustomers.value === 0) &&
    (newCustomers.value === null || newCustomers.value === 0) &&
    (averageTicket.value === null || averageTicket.value === 0) &&
    (!topSellingProducts.value || topSellingProducts.value.length === 0) &&
    (!salesByPeriod.value || salesByPeriod.value.length === 0)
  );
});

const isLoading = computed(() => loadingMetrics.value);

// Watcher para refrescar métricas cuando cambia la empresa
watch(() => companiesStore.currentCompany?.id, async (newCompanyId, oldCompanyId) => {
  if (newCompanyId && newCompanyId !== oldCompanyId) {
    try {
      const result = await metricsStore.loadAllMetrics();

      if (!result.success) {
        toast.add({
          title: t("common.error"),
          description: typeof result.error === 'string' ? result.error : t("errors.metrics.load.description"),
          color: "error",
        });
      }
    } catch (error) {
      toast.add({
        title: t("common.error"),
        description: t("errors.metrics.refresh.description"),
        color: "error",
      });
    }
  }
}, { immediate: false });

// Inicializar con empresa actual si existe
onMounted(() => {
  if (companiesStore.currentCompany?.id) {
    metricsStore.loadAllMetrics();
  }
});
</script>

<template>
  <UContainer class="py-8">
    <!-- Mostrar mensaje cuando no hay datos -->
    <div v-if="allMetricsEmpty && !isLoading" class="text-center py-12">
      <UIcon name="i-heroicons-chart-bar-20-solid" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

    <!-- Mostrar métricas cuando hay datos -->
    <DashboardMetricsInsights
      v-else
      :period="period"
      :range="range"
      :stats="statsData"
      :loading="isLoading"
    />
  </UContainer>
</template>
