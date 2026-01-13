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

  return {
    customers,
    pending,
    refreshCustomers: refresh,
  };
});
