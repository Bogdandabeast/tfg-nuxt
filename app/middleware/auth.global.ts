import { ROUTES } from "~/utils/routes";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const localePath = useLocalePath();

  try {
    await authStore.init();
  }
  catch {
    if (to.path.includes(ROUTES.DASHBOARD)) {
      return navigateTo(localePath(ROUTES.LOGIN));
    }
    return;
  }

  const user = authStore.user;
  const isAuthRoute = to.path.includes(ROUTES.LOGIN) || to.path.includes(ROUTES.SIGNUP);

  if (user && isAuthRoute) {
    return navigateTo(localePath(ROUTES.DASHBOARD));
  }

  if (!user && to.path.includes(ROUTES.DASHBOARD)) {
    return navigateTo(localePath(ROUTES.LOGIN));
  }
});
