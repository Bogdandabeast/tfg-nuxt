import { useAuthStore } from '~/app/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const protectedRoutes = ['/dashboard']
  const publicRoutes = ['/login', '/signup']

  if (authStore.loggedIn && publicRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }

  if (!authStore.loggedIn && protectedRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})