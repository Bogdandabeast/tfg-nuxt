export function useCompanySelection() {
  const selectedCompanyId = ref<string | null>(null);

  function setSelectedCompanyId(id: string | null) {
    selectedCompanyId.value = id;
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
