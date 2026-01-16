export function useCompanySelection() {
  const selectedCompanyId = ref<string | null>(
    import.meta.client ? localStorage.getItem("selectedCompanyId") : null,
  );

  function setSelectedCompanyId(id: string | null) {
    selectedCompanyId.value = id;
    if (import.meta.client) {
      if (id) {
        localStorage.setItem("selectedCompanyId", id);
      }
      else {
        localStorage.removeItem("selectedCompanyId");
      }
    }
  }

  function clearSelection() {
    setSelectedCompanyId(null);
  }

  return {
    selectedCompanyId: readonly(selectedCompanyId),
    setSelectedCompanyId,
    clearSelection,
  };
}
