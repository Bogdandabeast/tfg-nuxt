import type { Company } from "~~/lib/db/queries/companies";
import { defineStore } from "pinia";

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

  return {
    companies,
    pending,
    refreshCompanies: refresh,
    currentCompany,
    setCurrentCompany,
  };
});
