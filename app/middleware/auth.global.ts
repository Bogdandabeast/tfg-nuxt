import { useAuthStore } from "~~/app/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const protectedRoutes = ["/dashboard"];
  const publicRoutes = ["/login", "/signup"];

  if (!authStore.user && to.path.startsWith("/dashboard")) {
    return navigateTo("/login");
  }
});
