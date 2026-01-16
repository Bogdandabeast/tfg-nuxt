import { storeToRefs } from "pinia";
import { useCompanySelection } from "~~/composables/useCompanySelection";

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  const { selectedCompanyId } = useCompanySelection();

  const hasNoCurrentCompany = !currentCompany.value && !selectedCompanyId.value;
  const isCompaniesPage = to.path.startsWith("/dashboard/companies");

  // If no company selected and no saved ID, and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && !isCompaniesPage) {
    return navigateTo("/dashboard/companies");
  }
});
