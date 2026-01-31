import type { Customer, NewCustomer } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useCustomersApi() {
  const { $csrfFetch } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n();
  const isCreateCustomerLoading = ref(false);
  const isUpdateCustomerLoading = ref(false);
  const isDeleteCustomerLoading = ref(false);

  async function createCustomer(customerData: NewCustomer) {
    isCreateCustomerLoading.value = true;
    try {
      const response = await $csrfFetch<Customer>("/api/customers", {
        method: "POST",
        body: customerData,
      });
      return response;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("error.title") || "Error",
        description: t("error.generic") || message,
        color: "error",
      });
      return null;
    }
    finally {
      isCreateCustomerLoading.value = false;
    }
  }

  async function updateCustomer(id: string, customerData: Partial<NewCustomer>) {
    isUpdateCustomerLoading.value = true;
    try {
      const response = await $csrfFetch<Customer>(`/api/customers/${id}`, {
        method: "PUT",
        body: customerData,
      });
      return response;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("error.title") || "Error",
        description: t("error.generic") || message,
        color: "error",
      });
      return null;
    }
    finally {
      isUpdateCustomerLoading.value = false;
    }
  }

  async function deleteCustomer(id: string) {
    if (!id || typeof id !== "string" || id.trim() === "") {
      toast.add({
        title: t("error.title") || "Error",
        description: t("customers.invalidId") || "Please enter a valid Customer ID to delete.",
        color: "error",
      });
      return false;
    }
    isDeleteCustomerLoading.value = true;
    try {
      const companiesStore = useCompaniesStore();
      await $csrfFetch(`/api/customers/${id}`, {
        method: "DELETE",
        body: { company_id: companiesStore.currentCompany!.id },
      });
      const customersStore = useCustomersStore();
      customersStore.refreshCustomers();
      toast.add({
        title: t("common.success") || "Success",
        description: t("forms.customerForm.deletedSuccess") || "Customer deleted successfully!",
        color: "success",
      });
      return true;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      toast.add({
        title: t("common.error") || "Error",
        description: message,
        color: "error",
      });
      return false;
    }
    finally {
      isDeleteCustomerLoading.value = false;
    }
  }

  return {
    isCreateCustomerLoading,
    createCustomer,
    isUpdateCustomerLoading,
    updateCustomer,
    isDeleteCustomerLoading,
    deleteCustomer,
  };
}
