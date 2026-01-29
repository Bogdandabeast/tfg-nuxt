import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  company_id?: string | null;
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
    watch: [apiUrl],
  });

  const currentProductId = ref<string | null>(null);

  const {
    data: currentProductResponse,
    pending: currentProductPending,
    error: currentProductError,
  } = useFetch<{ product: Product }>(() => currentProductId.value ? `/api/products/${currentProductId.value}` : "", {
    lazy: true,
  });

  const getProductById = (productId: string) => {
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
