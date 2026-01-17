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

  // Reactive variable for specific product ID
  const currentProductId = ref<number | null>(null);

  // useFetch for specific product
  const {
    data: currentProductResponse,
    pending: currentProductPending,
    error: currentProductError,
  } = useFetch<{ product: Product }>(() => currentProductId.value ? `/api/products/${currentProductId.value}` : "", {
    lazy: true,
  });

  // Method to fetch a specific product by ID
  const getProductById = (productId: number) => {
    currentProductId.value = productId;
    return {
      data: computed(() => currentProductResponse.value?.product || null),
      pending: currentProductPending,
      error: currentProductError,
    };
  };

  return {
    products,
    pending,
    refreshProducts: refresh,
    getProductById,
  };
});
