import type { Customer, NewCustomer } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";

export function useCustomersApi() {
  const { $csrfFetch } = useNuxtApp();
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
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isCreateCustomerLoading.value = false;
    }
  }

  async function updateCustomer(id: number, customerData: Partial<NewCustomer>) {
    isUpdateCustomerLoading.value = true;
    try {
      const response = await $csrfFetch<Customer>(`/api/customers/${id}`, {
        method: "PUT",
        body: customerData,
      });
      return response;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isUpdateCustomerLoading.value = false;
    }
  }

  async function deleteCustomer(id: number) {
    isDeleteCustomerLoading.value = true;
    try {
      await $csrfFetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      return true;
    }
    catch (error) {
      getFetchErrorMessage(error);
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
