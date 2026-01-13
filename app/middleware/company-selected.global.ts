import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  const hasNoCurrentCompany = !currentCompany.value;
  const isDashboardRoute = to.path.startsWith("/dashboard");
  const isCompaniesPage = to.path.startsWith("/dashboard/companies");

  // If no company selected and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && isDashboardRoute && !isCompaniesPage) {
    return navigateTo("/dashboard/companies");
  }
});
