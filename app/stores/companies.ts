import type { Company } from "~~/lib/db/queries/companies";
import { defineStore } from "pinia";
import { watch } from "vue";
import { useBrowserStorage } from "~~/composables/useBrowserStorage";

export const useCompaniesStore = defineStore("companies", () => {
  const {
    data: companies,
    pending,
    refresh,
  } = useFetch<Company[]>("/api/companies", {
    lazy: true,
    default: () => [],
  });

  const { set: setStorage, get: getStorage, remove: removeStorage } = useBrowserStorage("selectedCompanyId");

  const currentCompany = ref<Company | null>(null);

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company;
    if (company) {
      setStorage(String(company.id));
    }
    else {
      removeStorage();
    }
  }

  // Watch for companies to load saved company
  watch(companies, (newCompanies) => {
    if (newCompanies && newCompanies.length > 0 && !currentCompany.value) {
      const savedId = getStorage();
      if (savedId) {
        const company = newCompanies.find(c => c.id === Number.parseInt(savedId));
        if (company) {
          currentCompany.value = company;
        }
        else {
          // Company no longer exists, remove from storage
          removeStorage();
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
