export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();
  try {
    await authStore.init();
  }
  catch (error) {
    console.error("Auth middleware error", error);
    return navigateTo("/");
  }

  if (!authStore.user) {
    return navigateTo("/");
  }
});
