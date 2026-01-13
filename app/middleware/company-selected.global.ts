import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany, companies } = storeToRefs(companiesStore);

  const hasNoCurrentCompany = !currentCompany.value;
  const hasCompanies = companies.value?.length > 0;
  const isDashboardRoute = to.path.startsWith("/dashboard");
  const isCompaniesPage = to.path.startsWith("/dashboard/companies");

  // If no company selected, companies exist, and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && hasCompanies && isDashboardRoute && !isCompaniesPage) {
    return navigateTo("/dashboard/companies");
  }
});
