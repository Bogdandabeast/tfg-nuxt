export function useDeletingById() {
  const deletingIds = ref<Set<number>>(new Set());

  const isDeleting = (id: number) => deletingIds.value.has(id);

  const deleteById = async (id: number, deleteFn: () => Promise<boolean | string>) => {
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
