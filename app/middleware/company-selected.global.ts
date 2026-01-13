import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany, companies } = storeToRefs(companiesStore);

  // If no company selected, companies exist, and route is under /dashboard but not under /dashboard/companies, redirect
  if (!currentCompany.value && companies.value?.length > 0 && to.path.startsWith("/dashboard") && !to.path.startsWith("/dashboard/companies")) {
    return navigateTo("/dashboard/companies");
  }
});
