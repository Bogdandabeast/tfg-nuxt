import { useAuthStore } from "~/app/stores/auth";

export function useAuth() {
  const store = useAuthStore();

  return {
    ...store,
  };
}
