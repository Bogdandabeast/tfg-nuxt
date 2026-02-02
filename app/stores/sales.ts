import type { Sale } from "~~/types/api";
import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

export const useSalesStore = defineStore("sales", () => {
  const companiesStore = useCompaniesStore();

  const apiUrl = computed(() => {
    if (!companiesStore.currentCompany?.id) {
      return null;
    }
    return `/api/sales?company_id=${companiesStore.currentCompany.id}`;
  });
  const {
    data: salesResponse,
    pending,
    refresh,
  } = useFetch<{ sales: Sale[] }>(() => apiUrl.value ?? "", {
    lazy: true,
    watch: [apiUrl],
    immediate: !!companiesStore.currentCompany?.id,
  });

  const sales = computed(() => salesResponse.value?.sales || []);

  const currentSaleId = ref<string | null>(null);

  const {
    data: currentSaleResponse,
    pending: currentSalePending,
    error: currentSaleError,
    refresh: refreshCurrentSale,
  } = useFetch<{ sale: Sale }>(() => currentSaleId.value ? `/api/sales/${currentSaleId.value}` : "", {
    lazy: true,
  });

  const getSaleById = (saleId: string) => {
    currentSaleId.value = saleId;
    return {
      data: computed(() => currentSaleResponse.value?.sale || null),
      pending: currentSalePending,
      error: currentSaleError,
    };
  };

  return {
    sales,
    pending,
    refreshSales: refresh,
    getSaleById,
    refreshCurrentSale,
  };
});
