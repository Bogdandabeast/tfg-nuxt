import type { NewSale, Sale } from "~~/types/api";
import { handleApiError } from "~~/utils/api-error-handler";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useSalesApi() {
  const { $csrfFetch } = useNuxtApp();
  const isCreateSaleLoading = ref(false);
  const isDeleteSaleLoading = ref(false);
  const isUpdateSaleLoading = ref(false);

  async function createSale(saleData: NewSale) {
    isCreateSaleLoading.value = true;
    try {
      const response = await $csrfFetch<Sale>("/api/sales", {
        method: "POST",
        body: saleData,
      });
      return response;
    }
    catch (error) {
      handleApiError(error, "sales");
      return null;
    }
    finally {
      isCreateSaleLoading.value = false;
    }
  }

  async function updateSale(id: string, saleData: Partial<NewSale>) {
    isUpdateSaleLoading.value = true;
    try {
      const response = await $csrfFetch<{ sale: Sale }>(`/api/sales/${id}`, {
        method: "PUT",
        body: saleData,
      });
      return response.sale;
    }
    catch (error) {
      handleApiError(error, "sales");
      return null;
    }
    finally {
      isUpdateSaleLoading.value = false;
    }
  }

  async function deleteSale(id: string, companyId: string) {
    isDeleteSaleLoading.value = true;
    try {
      await $csrfFetch(`/api/sales/${id}`, {
        method: "DELETE",
        body: { company_id: companyId },
      });
      return true;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return false;
    }
    finally {
      isDeleteSaleLoading.value = false;
    }
  }

  return {
    isCreateSaleLoading,
    createSale,
    isUpdateSaleLoading,
    updateSale,
    isDeleteSaleLoading,
    deleteSale,
  };
}
