import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

// Assuming a type for Product
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  company_id?: number | null;
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
  } = useFetch<Product[]>(() => apiUrl.value ?? "", {
    lazy: true,
    default: () => [],
    // Watch the computed URL to refetch when it changes
    watch: [apiUrl],
  });

  return {
    products,
    pending,
    refreshProducts: refresh,
  };
});
