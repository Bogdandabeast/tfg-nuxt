import { authClient } from "~~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);
  const user = session.value?.user;

  const event = useRequestEvent();
  if (event) {
    event.context.user = user;
  }

  if (user) {
    if (to.path === "/login" || to.path === "/signup") {
      return navigateTo("/dashboard");
    }
  }
  else {
    if (to.path.startsWith("/dashboard")) {
      return navigateTo("/login");
    }
  }
});
