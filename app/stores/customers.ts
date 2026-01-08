import { defineStore } from "pinia";
import { useCompaniesStore } from "./companies";

// Assuming a type for Customer
type Customer = {
  id: number;
  name: string;
  // Add other properties as needed
};

export const useCustomersStore = defineStore("customers", () => {
  const companiesStore = useCompaniesStore();

  const apiUrl = computed(() => {
    if (!companiesStore.currentCompany?.id) {
      return null;
    }
    return `/api/customers?company_id=${companiesStore.currentCompany.id}`;
  });

  const {
    data: customers,
    pending,
    refresh,
  } = useFetch<Customer[]>(apiUrl, {
    lazy: true,
    default: () => [],
    watch: [apiUrl],
  });

  async function createCustomer(customerData: Partial<Customer>) {
    if (!companiesStore.currentCompany?.id)
      return;
    await useFetch("/api/customers", {
      method: "POST",
      body: { ...customerData, company_id: companiesStore.currentCompany.id },
    });
    await refresh();
  }

  async function updateCustomer(id: number, customerData: Partial<Customer>) {
    await useFetch(`/api/customers/${id}`, {
      method: "PUT",
      body: customerData,
    });
    await refresh();
  }

  async function deleteCustomer(id: number) {
    await useFetch(`/api/customers/${id}`, {
      method: "DELETE",
    });
    await refresh();
  }

  return {
    customers,
    pending,
    refreshCustomers: refresh,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
});
