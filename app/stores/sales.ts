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
      return "";
    }
    return `/api/sales?company_id=${companiesStore.currentCompany.id}`;
  });

  const {
    data: salesResponse,
    pending,
    refresh: refreshSales,
  } = useFetch<{ sales: Sale[] }>(() => apiUrl.value, {
    lazy: true,
    watch: [apiUrl],
  });

  const sales = computed(() => salesResponse.value?.sales || []);

  return {
    sales,
    pending,
    refreshSales,
  };
});
