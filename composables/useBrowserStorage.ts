export function useBrowserStorage(key: string) {
  const set = (value: string) => {
    if (import.meta.client) {
      localStorage.setItem(key, value);
    }
  };

  const get = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(key);
    }
    return null;
  };

  const remove = () => {
    if (import.meta.client) {
      localStorage.removeItem(key);
    }
  };

  return {
    set,
    get,
    remove,
  };
}
