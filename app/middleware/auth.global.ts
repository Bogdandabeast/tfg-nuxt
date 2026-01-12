import { useAuthStore } from "~~/app/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.user && to.path.startsWith("/dashboard")) {
    return navigateTo("/login");
  }
});
