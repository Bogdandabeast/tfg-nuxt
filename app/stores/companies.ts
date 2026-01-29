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

  watch(companies, (newCompanies) => {
    if (newCompanies && newCompanies.length > 0 && !currentCompany.value) {
      const savedId = selectedCompanyId.value;
      if (savedId) {
        const company = newCompanies.find(c => c.id === savedId);
        if (company) {
          currentCompany.value = company;
        }
        else {
          setSelectedCompanyId(null);
        }
      }
    }
  });

  const currentCompanyId = ref<string | null>(null);

  const {
    data: currentCompanyResponse,
    pending: currentCompanyPending,
    error: currentCompanyError,
  } = useFetch<{ company: Company }>(() => currentCompanyId.value ? `/api/companies/${currentCompanyId.value}` : "", {
    lazy: true,
  });

  const getCompanyById = (companyId: string) => {
    currentCompanyId.value = companyId;
    return {
      data: computed(() => currentCompanyResponse.value?.company || null),
      pending: currentCompanyPending,
      error: currentCompanyError,
    };
  };

  return {
    companies,
    pending,
    refreshCompanies: refresh,
    currentCompany,
    setCurrentCompany,
    getCompanyById,
  };
});
