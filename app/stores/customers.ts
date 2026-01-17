import type { Customer } from "~~/lib/db/queries/customers";
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

  // Reactive variable for specific customer ID
  const currentCustomerId = ref<number | null>(null);

  // useFetch for specific customer
  const {
    data: currentCustomerResponse,
    pending: currentCustomerPending,
    error: currentCustomerError,
  } = useFetch<Customer>(() => currentCustomerId.value ? `/api/customers/${currentCustomerId.value}` : "", {
    lazy: true,
  });

  // Method to fetch a specific customer by ID
  const getCustomerById = (customerId: number) => {
    currentCustomerId.value = customerId;
    return {
      data: computed(() => currentCustomerResponse.value || null),
      pending: currentCustomerPending,
      error: currentCustomerError,
    };
  };

  return {
    customers,
    pending,
    refreshCustomers: refresh,
    getCustomerById,
  };
});
