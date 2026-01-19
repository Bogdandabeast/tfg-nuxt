import { defineStore } from "pinia";

export const useMetricsStore = defineStore("metrics", () => {
  // Configuration defaults
  const dateRange = ref<{start: string, end: string} | null>(null);
  const topLimit = ref(5);
  const selectedPeriod = ref<'daily'|'weekly'|'monthly'>('monthly');

  // Total Revenue
  const {
    data: revenueResponse,
    pending: loadingRevenue,
    refresh: refreshRevenue,
  } = useFetch<{ total: number }>('/api/metrics/revenue/total', {
    lazy: true,
  });

  // Total Customers
  const {
    data: customersResponse,
    pending: loadingCustomers,
    refresh: refreshCustomers,
  } = useFetch<{ total: number }>('/api/metrics/customers/total', {
    lazy: true,
  });

  // New Customers (with date range)
  const newCustomersUrl = computed(() => {
    if (!dateRange.value) return null;
    return `/api/metrics/customers/new?start=${dateRange.value.start}&end=${dateRange.value.end}`;
  });
  const {
    data: newCustomersResponse,
    pending: loadingNewCustomers,
    refresh: refreshNewCustomers,
  } = useFetch<{ total: number }>(() => newCustomersUrl.value || '', {
    lazy: true,
    watch: [dateRange],
  });

  // Average Ticket
  const {
    data: ticketResponse,
    pending: loadingAverageTicket,
    refresh: refreshAverageTicket,
  } = useFetch<{ average: number }>('/api/metrics/sales/average-ticket', {
    lazy: true,
  });

  // Top Selling Products
  const topProductsUrl = computed(() => `/api/metrics/products/top-selling?limit=${topLimit.value}`);
  const {
    data: topProductsResponse,
    pending: loadingTopProducts,
    refresh: refreshTopProducts,
  } = useFetch<{ products: any[] }>(() => topProductsUrl.value, {
    lazy: true,
    watch: [topLimit],
  });

  // Sales by Period
  const salesByPeriodUrl = computed(() => `/api/metrics/sales/by-period?period=${selectedPeriod.value}`);
  const {
    data: salesByPeriodResponse,
    pending: loadingSalesByPeriod,
    refresh: refreshSalesByPeriod,
  } = useFetch<{ data: any[] }>(() => salesByPeriodUrl.value, {
    lazy: true,
    watch: [selectedPeriod],
  });

  // Computed properties for easy access
  const totalRevenue = computed(() => revenueResponse.value?.total ?? null);
  const totalCustomers = computed(() => customersResponse.value?.total ?? null);
  const newCustomers = computed(() => newCustomersResponse.value?.total ?? null);
  const averageTicket = computed(() => ticketResponse.value?.average ?? null);
  const topSellingProducts = computed(() => topProductsResponse.value?.products ?? []);
  const salesByPeriod = computed(() => salesByPeriodResponse.value?.data ?? []);
  const totalSalesCount = computed(() => {
    return salesByPeriod.value.reduce((total, period) => total + (period.totalSales || 0), 0);
  });

  // Initialize defaults
  const initializeDefaults = () => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    dateRange.value = {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };
  };

  // Method to load all metrics
  const loadAllMetrics = async () => {
    await Promise.allSettled([
      refreshRevenue(),
      refreshCustomers(),
      refreshAverageTicket(),
      refreshTopProducts(),
      refreshSalesByPeriod(),
      dateRange.value ? refreshNewCustomers() : Promise.resolve(),
    ]);
  };

  // Configuration methods
  const setDateRange = (start: string, end: string) => {
    dateRange.value = { start, end };
  };

  const setTopLimit = (limit: number) => {
    topLimit.value = Math.min(Math.max(limit, 1), 100);
  };

  const setPeriod = (period: 'daily'|'weekly'|'monthly') => {
    selectedPeriod.value = period;
  };

  return {
    // Data
    totalRevenue,
    totalCustomers,
    newCustomers,
    averageTicket,
    topSellingProducts,
    salesByPeriod,
    totalSalesCount,

    // Loading states
    loadingRevenue,
    loadingCustomers,
    loadingNewCustomers,
    loadingAverageTicket,
    loadingTopProducts,
    loadingSalesByPeriod,

    // Configuration
    dateRange: readonly(dateRange),
    topLimit: readonly(topLimit),
    selectedPeriod: readonly(selectedPeriod),

    // Methods
    initializeDefaults,
    loadAllMetrics,
    setDateRange,
    setTopLimit,
    setPeriod,

    // Individual refreshes
    refreshRevenue,
    refreshCustomers,
    refreshNewCustomers,
    refreshAverageTicket,
    refreshTopProducts,
    refreshSalesByPeriod,
  };
});