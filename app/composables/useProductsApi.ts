import type { NewProduct, Product } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useProductsApi() {
  const { $csrfFetch } = useNuxtApp();
  const isCreateProductLoading = ref(false);
  const isUpdateProductLoading = ref(false);
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

  async function updateProduct(id: string, productData: Partial<NewProduct>) {
    isUpdateProductLoading.value = true;
    try {
      const response = await $csrfFetch<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: productData,
      });
      return response;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isUpdateProductLoading.value = false;
    }
  }

  async function deleteProduct(id: string) {
    isDeleteProductLoading.value = true;
    try {
      const companiesStore = useCompaniesStore();
      await $csrfFetch(`/api/products/${id}`, {
        method: "DELETE",
        body: { company_id: companiesStore.currentCompany!.id },
      });
      const productsStore = useProductsStore();
      productsStore.refreshProducts();
      const toast = useToast();
      toast.add({
        title: "Success",
        description: "Product deleted successfully!",
      });
      return true;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      const toast = useToast();
      toast.add({
        title: "Error",
        description: message,
        color: "error",
      });
      return false;
    }
    finally {
      isDeleteProductLoading.value = false;
    }
  }

  return {
    isCreateProductLoading,
    createProduct,
    isUpdateProductLoading,
    updateProduct,
    isDeleteProductLoading,
    deleteProduct,
  };
}
