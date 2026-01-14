export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();
  try {
    await authStore.init();
  }
  catch {
    return navigateTo("/");
  }

  if (!authStore.user) {
    return navigateTo("/");
  }
});
