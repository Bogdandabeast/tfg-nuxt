import type { Product } from "~~/lib/db/queries/products";
import { defineStore } from "pinia";

type DashboardMetricsResponse = {
  revenue: { total: number; error?: string };
  customers: { total: number; new: number; error?: string };
  sales: { averageTicket: number; byPeriod: unknown[]; totalCount: number; error?: string };
  products: { topSelling: Product[]; error?: string };
  meta?: {
    companyId: number;
    period: string;
    topLimit: number;
    dateRange?: { start: string; end: string };
    timestamp: string;
    hasErrors: boolean;
    errorCount: number;
  };
};

export const useMetricsStore = defineStore("metrics", () => {
  const companiesStore = useCompaniesStore();
  const toast = useToast();

  // URL dinámica con company_id siempre requerido
  const dashboardUrl = computed(() => {
    const companyId = companiesStore.currentCompany?.id;
    if (!companyId) {
      return null;
    }
    return `/api/metrics/dashboard?company_id=${companyId}`;
  });

  // Una sola petición para todas las métricas
  const {
    data: dashboardMetricsResponse,
    pending: loadingMetrics,
    refresh: refreshMetrics,
  } = useFetch<DashboardMetricsResponse>(() => dashboardUrl.value || "", {
    lazy: true,
    watch: [() => companiesStore.currentCompany?.id],
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
      return { success: false, error: "Failed to load metrics" };
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
