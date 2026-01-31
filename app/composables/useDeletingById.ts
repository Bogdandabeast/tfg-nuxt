export function useDeletingById() {
  const deletingIds = ref<Set<string>>(new Set());

  const isDeleting = (id: string) => deletingIds.value.has(id);

  const deleteById = async (id: string, deleteFn: () => Promise<boolean | string>) => {
    deletingIds.value.add(id);
    try {
      return await deleteFn();
    }
    finally {
      deletingIds.value.delete(id);
    }
  };

  return {
    isDeleting,
    deleteById,
  };
}
