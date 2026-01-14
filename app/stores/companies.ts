import type { Company } from "~~/lib/db/queries/companies";
import { defineStore } from "pinia";

export const useCompaniesStore = defineStore("companies", () => {
  const companies = ref<Company[]>([]);
  const pending = ref(true); // Start as true to avoid hydration mismatch
  const currentCompany = ref<Company | null>(null);
  const initialized = ref(false);

  async function refreshCompanies() {
    if (pending.value && initialized.value)
      return;

    pending.value = true;
    try {
      const data = await $fetch<Company[]>("/api/companies");
      companies.value = data || [];
    }
    catch (error) {
      console.error("Failed to fetch companies:", error);
      companies.value = [];
    }
    finally {
      pending.value = false;
      initialized.value = true;
    }
  }

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company;
  }

  // Initialize on store creation
  if (import.meta.client) {
    refreshCompanies();
  }

  return {
    companies,
    pending,
    refreshCompanies,
    currentCompany,
    setCurrentCompany,
  };
});
