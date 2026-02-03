import type { Company, NewCompany } from "~~/types/api";
import { getFetchErrorMessage } from "~~/utils/error-handler";
import { companyCreateSchema } from "~~/utils/schemas/companies";

export function useCompaniesApi() {
  const { $csrfFetch } = useNuxtApp();
  const isCreateCompanyLoading = ref(false);
  const isUpdateCompanyLoading = ref(false);
  const isDeleteCompanyLoading = ref(false);

  async function createCompany(companyData: NewCompany) {
    const validation = companyCreateSchema.safeParse(companyData);
    if (!validation.success) {
      const toast = useToast();
      toast.add({
        title: "Validation Error",
        description: validation.error.issues[0]?.message || "Invalid input",
        color: "error",
      });
      return null;
    }

    isCreateCompanyLoading.value = true;
    try {
      const response = await $csrfFetch<Company>("/api/companies", {
        method: "POST",
        body: companyData,
      });
      return response;
    }
    catch (error) {
      getFetchErrorMessage(error);
      return null;
    }
    finally {
      isCreateCompanyLoading.value = false;
    }
  }

  async function updateCompany(id: string, companyData: Partial<NewCompany>) {
    isUpdateCompanyLoading.value = true;
    try {
      const response = await $csrfFetch<Company>(`/api/companies/${id}`, {
        method: "PUT",
        body: companyData,
      });
      return response;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      const toast = useToast();
      toast.add({
        title: "Error",
        description: message,
        color: "error",
      });
      return null;
    }
    finally {
      isUpdateCompanyLoading.value = false;
    }
  }

  async function deleteCompany(id: string) {
    isDeleteCompanyLoading.value = true;
    try {
      await $csrfFetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      return true;
    }
    catch (error) {
      const message = getFetchErrorMessage(error);
      return message;
    }
    finally {
      isDeleteCompanyLoading.value = false;
    }
  }

  return {
    isCreateCompanyLoading,
    createCompany,
    isUpdateCompanyLoading,
    updateCompany,
    isDeleteCompanyLoading,
    deleteCompany,
  };
}
