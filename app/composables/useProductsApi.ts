import type { NewProduct, Product } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useProductsApi() {
  const { $csrfFetch } = useNuxtApp();
  const isCreateProductLoading = ref(false);
  const isDeleteProductLoading = ref(false);

  async function createProduct(productData: NewProduct) {
    isCreateProductLoading.value = true;
    try {
      const response = await $csrfFetch<Product>("/api/products", {
        method: "POST",
        body: productData,
      });
      return response;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isCreateProductLoading.value = false;
    }
  }

  async function deleteProduct(id: number) {
    isDeleteProductLoading.value = true;
    try {
      await $csrfFetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      return true;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return false;
    }
    finally {
      isDeleteProductLoading.value = false;
    }
  }

  return {
    isCreateProductLoading,
    createProduct,
    isDeleteProductLoading,
    deleteProduct,
  };
}
