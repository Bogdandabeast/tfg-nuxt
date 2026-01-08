import { useAuthStore } from '~/app/stores/auth'

export const useAuth = () => {
  const store = useAuthStore()

  return {
    ...store,
  }
}
