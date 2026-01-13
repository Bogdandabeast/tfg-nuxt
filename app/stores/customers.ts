import type { Customer, CustomerInsert } from "~~/lib/db/queries/customers";
import { defineStore } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

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
  } = useFetch<Customer[]>(() => apiUrl.value ?? "", {
    lazy: true,
    default: () => [],
    watch: [apiUrl],
  });

  async function createCustomer(customerData: Partial<CustomerInsert>) {
    if (!companiesStore.currentCompany?.id)
      return;
    const toast = useToast();
    const { csrf } = useCsrf();
    try {
      await useFetch("/api/customers", {
        method: "POST",
        body: { ...customerData, company_id: companiesStore.currentCompany.id },
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: "Success", description: "Customer created successfully", color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: "Error", description: "Failed to create customer", color: "error" });
    }
  }

  async function updateCustomer(id: number, customerData: Partial<CustomerInsert>) {
    const toast = useToast();
    const { csrf } = useCsrf();
    try {
      await useFetch(`/api/customers/${id}`, {
        method: "PUT",
        body: customerData,
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: "Success", description: "Customer updated successfully", color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: "Error", description: "Failed to update customer", color: "error" });
    }
  }

  async function deleteCustomer(id: number) {
    const toast = useToast();
    const { csrf } = useCsrf();
    try {
      await useFetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: "Success", description: "Customer deleted successfully", color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: "Error", description: "Failed to delete customer", color: "error" });
    }
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
