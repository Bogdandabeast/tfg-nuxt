import { ROUTES } from "~/utils/routes";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.includes("/dashboard")) {
    return;
  }

  const authStore = useAuthStore();
  try {
    await authStore.init();
  }
  catch (error) {
    console.error("Auth middleware error", error);
    return navigateTo(useLocalePath()(ROUTES.LOGIN));
  }

  if (!authStore.user) {
    return navigateTo(useLocalePath()(ROUTES.LOGIN));
  }
});
