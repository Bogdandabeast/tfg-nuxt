export function useSales() {
  // TO DO tipar las variables y llamadas a la api

  const sales = ref<any[]>([]);
  const pending = ref(false);

  async function getAllSales() {
    pending.value = true;
    const { data, pending: fetchPending } = await useFetch("/api/sales", {
      lazy: true,
      default: () => [],
    });
    sales.value = data.value as any[];
    pending.value = fetchPending.value;
  }

  // Initial fetch when composable is used
  getAllSales();

  return {
    sales,
    pending,
    getAllSales,
  };
}