import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

type Sale = {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  sale_date: string;
  company_id: number;
};

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

  return {
    sales,
    pending,
    refreshSales: refresh,
  };
});
