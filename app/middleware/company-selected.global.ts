export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany, companies } = storeToRefs(companiesStore);

  // If no company selected, companies exist, and not going to companies page, redirect
  if (!currentCompany.value && companies.value?.length > 0 && to.path !== "/dashboard/companies" && to.path.startsWith("/dashboard")) {
    return navigateTo("/dashboard/companies");
  }
});
