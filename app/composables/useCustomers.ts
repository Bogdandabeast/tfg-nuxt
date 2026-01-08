export function useCustomers() {
  // TO DO tipar las variables y llamadas a la api

  const customers = ref<any[]>([]);
  const pending = ref(false);

  async function getAllCustomers() {
    pending.value = true;
    const { data, pending: fetchPending } = await useFetch("/api/customers", {
      lazy: true,
      default: () => [],
    });
    customers.value = data.value as any[];
    pending.value = fetchPending.value;
  }

  async function getCustomerById(id: string) {
    const { data } = await useFetch(`/api/customers/${id}`);
    return data.value;
  }

  async function createCustomer(customerData: any) {
    await useFetch("/api/customers", {
      method: "POST",
      body: customerData,
    });
    await getAllCustomers(); // Refresh list after creation
  }

  async function updateCustomer(id: string, customerData: any) {
    await useFetch(`/api/customers/${id}`, {
      method: "PUT",
      body: customerData,
    });
    await getAllCustomers(); // Refresh list after update
  }

  async function deleteCustomer(id: string) {
    await useFetch(`/api/customers/${id}`, {
      method: "DELETE",
    });
    await getAllCustomers(); // Refresh list after deletion
  }

  // Initial fetch when composable is used
  getAllCustomers();

  return {
    customers,
    pending,
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}