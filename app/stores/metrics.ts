import type { DashboardMetricsResponse } from "~/types/api";
import { defineStore } from "pinia";
import { z } from "zod";
import { SalesByPeriodSchema, TopSellingProductSchema } from "~~/utils/schemas/metrics";

export const useMetricsStore = defineStore("metrics", () => {
  const companiesStore = useCompaniesStore();
  const toast = useToast();

  const dashboardUrl = computed(() => {
    const companyId = companiesStore.currentCompany?.id;
    if (!companyId) {
      return null;
    }
    return `/api/metrics/dashboard?company_id=${companyId}`;
  });

  const {
    data: dashboardMetricsResponse,
    pending: loadingMetrics,
    refresh: refreshMetrics,
  } = useFetch<DashboardMetricsResponse>(() => dashboardUrl.value || "", {
    lazy: true,
    watch: [() => companiesStore.currentCompany?.id],
    transform: (data: unknown) => {
      const typedData = data as DashboardMetricsResponse;

      if (typedData.sales?.byPeriod) {
        const result = z.array(SalesByPeriodSchema).safeParse(typedData.sales.byPeriod);
        if (result.success) {
          typedData.sales.byPeriod = result.data;
        }
        else {
          console.error("Failed to parse sales by period:", result.error);
          typedData.sales.byPeriod = [];
        }
      }

      if (typedData.products?.topSelling) {
        const result = z.array(TopSellingProductSchema).safeParse(typedData.products.topSelling);
        if (result.success) {
          typedData.products.topSelling = result.data;
        }
        else {
          console.error("Failed to parse top selling products:", result.error);
          typedData.products.topSelling = [];
        }
      }

      return typedData;
    },
  });

  const totalRevenue = computed(() => dashboardMetricsResponse.value?.revenue.total ?? null);
  const totalCustomers = computed(() => dashboardMetricsResponse.value?.customers.total ?? null);
  const newCustomers = computed(() => dashboardMetricsResponse.value?.customers.new ?? null);
  const averageTicket = computed(() => dashboardMetricsResponse.value?.sales.averageTicket ?? null);
  const topSellingProducts = computed(() => dashboardMetricsResponse.value?.products.topSelling ?? []);
  const salesByPeriod = computed(() => dashboardMetricsResponse.value?.sales.byPeriod ?? []);
  const totalSalesCount = computed(() => dashboardMetricsResponse.value?.sales.totalCount ?? 0);

  const loadAllMetrics = async () => {
    try {
      await refreshMetrics();

      const response = dashboardMetricsResponse.value;
      if (response?.revenue.error) {
        toast.add({
          title: "Error",
          description: `Revenue: ${response.revenue.error}`,
          color: "error",
        });
      }
      if (response?.customers.error) {
        toast.add({
          title: "Error",
          description: `Customers: ${response.customers.error}`,
          color: "error",
        });
      }
      if (response?.sales.error) {
        toast.add({
          title: "Error",
          description: `Sales: ${response.sales.error}`,
          color: "error",
        });
      }
      if (response?.products.error) {
        toast.add({
          title: "Error",
          description: `Products: ${response.products.error}`,
          color: "error",
        });
      }

      return { success: true };
    }
    catch (error) {
      console.warn(error);
    }
  };

  return {
    totalRevenue,
    totalCustomers,
    newCustomers,
    averageTicket,
    topSellingProducts,
    salesByPeriod,
    totalSalesCount,
    loadingMetrics,
    loadAllMetrics,
  };
});
