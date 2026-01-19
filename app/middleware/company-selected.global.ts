import { storeToRefs } from "pinia";
import { useCompanySelection } from "~~/app/composables/useCompanySelection";
import { getCompaniesWithRedirect } from "~/utils/routes";

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.includes("/dashboard")) {
    return;
  }

  const companiesStore = useCompaniesStore();
  const { currentCompany } = storeToRefs(companiesStore);

  const { selectedCompanyId } = useCompanySelection();

  const hasNoCurrentCompany = !currentCompany.value && !selectedCompanyId.value;
  const isCompaniesPage = to.path.includes("/companies");

  // If no company selected and no saved ID, and route is under /dashboard but not under /dashboard/companies, redirect
  if (hasNoCurrentCompany && !isCompaniesPage) {
    const redirectParam = encodeURIComponent(to.fullPath);
    return navigateTo(useLocalePath()(getCompaniesWithRedirect(redirectParam)));
  }
});
