export default defineNuxtRouteMiddleware((to) => {
  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  // If no company selected and not going to companies page, redirect
  if (!currentCompany.value && to.path !== "/dashboard/companies") {
    return navigateTo("/dashboard/companies");
  }
});
