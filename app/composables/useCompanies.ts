export function useCompanies() {
  // TO DO tipar las variables y llamadas a la api

  const companies = ref<any[]>([]);
  const pending = ref(false);

  async function getAllCompanies() {
    pending.value = true;
    const { data, pending: fetchPending } = await useFetch("/api/companies", {
      lazy: true,
      default: () => [],
    });
    companies.value = data.value as any[];
    pending.value = fetchPending.value;
  }

  async function getCompanyById(id: string) {
    const { data } = await useFetch(`/api/companies/${id}`);
    return data.value;
  }

  async function createCompany(companyData: any) {
    await useFetch("/api/companies", {
      method: "POST",
      body: companyData,
    });
    await getAllCompanies(); // Refresh list after creation
  }

  async function updateCompany(id: string, companyData: any) {
    await useFetch(`/api/companies/${id}`, {
      method: "PUT",
      body: companyData,
    });
    await getAllCompanies(); // Refresh list after update
  }

  async function deleteCompany(id: string) {
    await useFetch(`/api/companies/${id}`, {
      method: "DELETE",
    });
    await getAllCompanies(); // Refresh list after deletion
  }

  // Initial fetch when composable is used
  getAllCompanies();

  return {
    companies,
    pending,
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}
