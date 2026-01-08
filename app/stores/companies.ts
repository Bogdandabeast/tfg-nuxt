import { defineStore } from "pinia";

// Assuming a type for Company, which should be defined in a types file
type Company = {
  id: number;
  name: string;
  // Add other properties as needed
};

export const useCompaniesStore = defineStore("companies", () => {
  const {
    data: companies,
    pending,
    refresh,
  } = useFetch<Company[]>("/api/companies", {
    lazy: true,
    default: () => [],
  });

  const currentCompany = ref<Company | null>(null);

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company;
  }

  // Set the first company as current by default
  watch(companies, (newCompanies) => {
    if (newCompanies && newCompanies.length > 0 && !currentCompany.value) {
      setCurrentCompany(newCompanies[0]);
    }
  }, { immediate: true });

  async function createCompany(companyData: Partial<Company>) {
    await useFetch("/api/companies", {
      method: "POST",
      body: companyData,
    });
    await refresh();
  }

  async function updateCompany(id: number, companyData: Partial<Company>) {
    await useFetch(`/api/companies/${id}`, {
      method: "PUT",
      body: companyData,
    });
    await refresh();
  }

  async function deleteCompany(id: number) {
    await useFetch(`/api/companies/${id}`, {
      method: "DELETE",
    });
    await refresh();
    if (currentCompany.value?.id === id) {
      const firstCompany = companies.value?.[0] || null;
      setCurrentCompany(firstCompany);
    }
  }

  return {
    companies,
    pending,
    refreshCompanies: refresh,
    currentCompany,
    setCurrentCompany,
    createCompany,
    updateCompany,
    deleteCompany,
  };
});
