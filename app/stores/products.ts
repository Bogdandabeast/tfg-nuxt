import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

// Assuming a type for Product
type Product = {
  id: number;
  name: string;
  // Add other properties as needed
};

export const useProductsStore = defineStore("products", () => {
  const companiesStore = useCompaniesStore();

  const apiUrl = computed(() => {
    if (!companiesStore.currentCompany?.id) {
      return null;
    }
    return `/api/products?company_id=${companiesStore.currentCompany.id}`;
  });

  const {
    data: products,
    pending,
    refresh,
  } = useFetch<Product[]>(apiUrl, {
    lazy: true,
    default: () => [],
    // Watch the computed URL to refetch when it changes
    watch: [apiUrl],
  });

  async function createProduct(productData: Partial<Product>) {
    if (!companiesStore.currentCompany?.id)
      return;
    await useFetch("/api/products", {
      method: "POST",
      body: { ...productData, company_id: companiesStore.currentCompany.id },
    });
    await refresh();
  }

  async function updateProduct(id: number, productData: Partial<Product>) {
    await useFetch(`/api/products/${id}`, {
      method: "PUT",
      body: productData,
    });
    await refresh();
  }

  async function deleteProduct(id: number) {
    await useFetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    await refresh();
  }

  return {
    products,
    pending,
    refreshProducts: refresh,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
