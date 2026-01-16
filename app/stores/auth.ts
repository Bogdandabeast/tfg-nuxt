import { createAuthClient } from "better-auth/vue";
import { ROUTES } from "~/utils/routes";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const isInitialized = ref(false);

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function init() {
    if (isInitialized.value) {
      return;
    }

    try {
      const data = await authClient.useSession(useFetch);
      session.value = data;
      isInitialized.value = true;
    }
    catch (error) {
      isInitialized.value = true; // Mark as initialized even on error to avoid retries
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "http://localhost:3000/dashboard",
      fetchOptions: {
        headers,
      },
    });
  }

  async function signIn(email: string, password: string, rememberMe: boolean) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: `http://localhost:3000${useLocalePath()(ROUTES.DASHBOARD)}`,
      fetchOptions: {
        headers,
      },
    });
    if (error) {
      // Handle error
      console.error(error);
      return;
    }
    navigateTo(useLocalePath()(ROUTES.DASHBOARD));
  }

  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
    navigateTo(useLocalePath()(ROUTES.HOME));
  }

  return {
    init,
    loading,
    signIn,
    signUp,
    signOut,
    user,
  };
});
