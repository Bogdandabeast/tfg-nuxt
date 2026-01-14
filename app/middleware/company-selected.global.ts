import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  const hasNoCurrentCompany = !currentCompany.value;
  const isCompaniesPage = to.path.startsWith("/dashboard/companies");

  // If no company selected and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && !isCompaniesPage) {
    return navigateTo("/dashboard/companies");
  }
});
