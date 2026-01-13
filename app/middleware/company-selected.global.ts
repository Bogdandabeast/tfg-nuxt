export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  // If no company selected and not going to companies page, redirect
  if (!currentCompany.value && to.path !== "/dashboard/companies" && to.path.startsWith("/dashboard")) {
    return navigateTo("/dashboard/companies");
  }
});
