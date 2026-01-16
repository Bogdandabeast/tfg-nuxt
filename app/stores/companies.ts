import type { Company } from "~~/lib/db/queries/companies";
import { defineStore } from "pinia";
import { watch } from "vue";
import { useCompanySelection } from "~~/composables/useCompanySelection";

export const useCompaniesStore = defineStore("companies", () => {
  const {
    data: companies,
    pending,
    refresh,
  } = useFetch<Company[]>("/api/companies", {
    lazy: true,
    default: () => [],
  });

  const { selectedCompanyId, setSelectedCompanyId } = useCompanySelection();

  const currentCompany = ref<Company | null>(null);

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company;
    setSelectedCompanyId(company ? String(company.id) : null);
  }

  // Watch for companies to load saved company
  watch(companies, (newCompanies) => {
    if (newCompanies && newCompanies.length > 0 && !currentCompany.value) {
      const savedId = selectedCompanyId.value;
      if (savedId) {
        const company = newCompanies.find(c => c.id === Number.parseInt(savedId, 10));
        if (company) {
          currentCompany.value = company;
        }
        else {
          // Company no longer exists, clear selection
          setSelectedCompanyId(null);
        }
      }
    }
  });

  return {
    companies,
    pending,
    refreshCompanies: refresh,
    currentCompany,
    setCurrentCompany,
  };
});
