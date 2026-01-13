import type { Customer, CustomerInsert } from "~~/lib/db/queries/customers";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useCompaniesStore } from "~~/app/stores/companies";

export const useCustomersStore = defineStore("customers", () => {
  const companiesStore = useCompaniesStore();
  const { t } = useI18n();

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
      await $fetch("/api/customers", {
        method: "POST",
        body: { ...customerData, company_id: companiesStore.currentCompany.id },
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: t("common.success"), description: t("customers.created"), color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: t("common.error"), description: t("customers.createFailed"), color: "error" });
    }
  }

  async function updateCustomer(id: number, customerData: Partial<CustomerInsert>) {
    const toast = useToast();
    const { csrf } = useCsrf();
    try {
      await $fetch(`/api/customers/${id}`, {
        method: "PUT",
        body: customerData,
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: t("common.success"), description: t("customers.updated"), color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: t("common.error"), description: t("customers.updateFailed"), color: "error" });
    }
  }

  async function deleteCustomer(id: number) {
    const toast = useToast();
    const { csrf } = useCsrf();
    try {
      await $fetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: { "csrf-token": csrf },
      });
      toast.add({ title: t("common.success"), description: t("customers.deleted"), color: "primary" });
      await refresh();
    }
    catch {
      toast.add({ title: t("common.error"), description: t("customers.deleteFailed"), color: "error" });
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
