import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = authClient.useSession();

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

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
      callbackURL: "http://localhost:3000/dashboard",
      fetchOptions: {
        headers,
      },
    });
    if (error) {
      // Handle error
      console.error(error);
      return;
    }
    navigateTo("/dashboard");
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
    navigateTo("/");
  }

  return {
    loading,
    signIn,
    signUp,
    signOut,
    user,
  };
});
