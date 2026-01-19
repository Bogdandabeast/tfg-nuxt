import { createAuthClient } from "better-auth/vue";
import { ROUTES } from "~/utils/routes";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const nuxtApp = useNuxtApp();
  const t = nuxtApp.$i18n.t;
  const toast = useToast();
  const { csrf } = useCsrf();
  const config = useRuntimeConfig();
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const isInitialized = ref(false);

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  const isSigningUp = ref(false);
  const isSigningIn = ref(false);

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
      isInitialized.value = true;
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    if (isSigningUp.value) return;

    isSigningUp.value = true;
    try {
      const headers = new Headers();
      headers.append("csrf-token", csrf);
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        fetchOptions: {
          headers,
        },
      });
      if (error) {
        toast.add({
          title: t("signup.toast.error.title"),
          description: t("signup.toast.error.description"),
          color: "error",
        });
        return;
      }
      toast.add({
        title: t("signup.toast.success.title"),
        description: t("signup.toast.success.description"),
        color: "success",
      });
      navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    } finally {
      isSigningUp.value = false;
    }
  }

  async function signIn(email: string, password: string, rememberMe: boolean) {
    if (isSigningIn.value) return;

    isSigningIn.value = true;
    try {
      const headers = new Headers();
      headers.append("csrf-token", csrf);
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        fetchOptions: {
          headers,
        },
      });
      if (error) {
        toast.add({
          title: t("login.toast.error.title"),
          description: t("login.toast.error.description"),
          color: "error",
        });
        return;
      }
      toast.add({
        title: t("login.toast.success.title"),
        description: t("login.toast.success.description"),
        color: "success",
      });
      navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    } finally {
      isSigningIn.value = false;
    }
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
    isSigningUp,
    isSigningIn,
  };
});
