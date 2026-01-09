import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

// Assuming a type for Sale
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
  } = useFetch<{ sales: Sale[] }>(apiUrl, {
    lazy: true,
    default: () => ({ sales: [] }),
    watch: [apiUrl],
  });

  async function createSale(saleData: Partial<Sale>) {
    if (!companiesStore.currentCompany?.id)
      return;
    await useFetch("/api/sales", {
      method: "POST",
      body: { ...saleData, company_id: companiesStore.currentCompany.id },
    });
    await refresh();
  }

  async function updateSale(id: number, saleData: Partial<Sale>) {
    await useFetch(`/api/sales/${id}`, {
      method: "PUT",
      body: saleData,
    });
    await refresh();
  }

  async function deleteSale(id: number) {
    await useFetch(`/api/sales/${id}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const sales = computed(() => salesResponse.value?.sales || []);

  return {
    sales,
    pending,
    refreshSales: refresh,
    createSale,
    updateSale,
    deleteSale,
  };
});
