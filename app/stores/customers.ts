import type { Customer } from "~~/types/api";
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

  const currentCustomerId = ref<string | null>(null);

  const {
    data: currentCustomerResponse,
    pending: currentCustomerPending,
    error: currentCustomerError,
    refresh: refreshCurrentCustomer,
  } = useFetch<{ customer: Customer }>(() => currentCustomerId.value ? `/api/customers/${currentCustomerId.value}` : "", {
    lazy: true,
  });

  const getCustomerById = (customerId: string) => {
    currentCustomerId.value = customerId;
    return {
      data: computed(() => currentCustomerResponse.value?.customer || null),
      pending: currentCustomerPending,
      error: currentCustomerError,
      refresh: refreshCurrentCustomer,
    };
  };

  return {
    customers,
    pending,
    refreshCustomers: refresh,
    getCustomerById,
    refreshCurrentCustomer,
  };
});
