import type { NewSale, Sale } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useSalesApi() {
  const { $csrfFetch } = useNuxtApp();
  const isCreateSaleLoading = ref(false);
  const isDeleteSaleLoading = ref(false);

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
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isCreateSaleLoading.value = false;
    }
  }

  async function deleteSale(id: number) {
    isDeleteSaleLoading.value = true;
    try {
      await $csrfFetch(`/api/sales/${id}`, {
        method: "DELETE",
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
    isDeleteSaleLoading,
    deleteSale,
  };
}
