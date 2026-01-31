import type { NewProduct, Product } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";
import { productIdParamSchema } from "~~/utils/schemas/products";

export function useProductsApi() {
  const { $csrfFetch } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n();
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
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("common.error") || "Error",
        description: message,
        color: "error",
      });
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
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("common.error") || "Error",
        description: message,
        color: "error",
      });
      return null;
    }
    finally {
      isUpdateProductLoading.value = false;
    }
  }

  async function deleteProduct(id: string) {
    const validation = productIdParamSchema.safeParse({ id });
    if (!validation.success) {
      toast.add({
        title: t("common.error") || "Error",
        description: t("products.invalidId") || "Please enter a valid Product ID to delete.",
        color: "error",
      });
      return false;
    }
    isDeleteProductLoading.value = true;
    try {
      const companiesStore = useCompaniesStore();
      await $csrfFetch(`/api/products/${id}`, {
        method: "DELETE",
        body: { company_id: companiesStore.currentCompany!.id },
      });
      const productsStore = useProductsStore();
      productsStore.refreshProducts();
      toast.add({
        title: t("common.success") || "Success",
        description: t("forms.productForm.deletedSuccess") || "Product deleted successfully!",
        color: "success",
      });
      return true;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("common.error") || "Error",
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
