export function useProducts() {
  // TO DO tipar las variables y llamadas a la api

  const products = ref<any[]>([]);
  const pending = ref(false);

  async function getAllProducts() {
    pending.value = true;
    const { data, pending: fetchPending } = await useFetch("/api/products", {
      lazy: true,
      default: () => [],
    });
    products.value = data.value as any[];
    pending.value = fetchPending.value;
  }

  async function getProductById(id: string) {
    const { data } = await useFetch(`/api/products/${id}`);
    return data.value;
  }

  async function createProduct(productData: any) {
    await useFetch("/api/products", {
      method: "POST",
      body: productData,
    });
    await getAllProducts(); // Refresh list after creation
  }

  async function updateProduct(id: string, productData: any) {
    await useFetch(`/api/products/${id}`, {
      method: "PUT",
      body: productData,
    });
    await getAllProducts(); // Refresh list after update
  }

  async function deleteProduct(id: string) {
    await useFetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    await getAllProducts(); // Refresh list after deletion
  }

  // Initial fetch when composable is used
  getAllProducts();

  return {
    products,
    pending,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}