import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  const savedCompanyId = import.meta.client
    ? localStorage.getItem("selectedCompanyId")
    : null;

  const hasNoCurrentCompany = !currentCompany.value && !savedCompanyId;
  const isCompaniesPage = to.path.startsWith("/dashboard/companies");

  // If no company selected and no saved ID, and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && !isCompaniesPage) {
    return navigateTo("/dashboard/companies");
  }
});
