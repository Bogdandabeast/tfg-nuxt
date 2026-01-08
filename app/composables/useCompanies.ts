import { useCompaniesStore } from "~/app/stores/companies";

export function useCompanies() {
  const store = useCompaniesStore();

  // The store is reactive, so we can return its properties directly.
  // Pinia's `storeToRefs` can be used in components if you need to pass reactive properties as props.
  return store;
}
