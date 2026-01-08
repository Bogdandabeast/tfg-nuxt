import type { UserWithId } from "~/lib/auth";
import { defineStore } from "pinia";
import { authClient } from "~/lib/auth-client";

export const useAuthStore = defineStore("auth", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  async function init() {
    if (session.value)
      return;
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user as UserWithId | null);
  const loading = computed(() => session.value?.isPending);
  const loggedIn = computed(() => !!session.value?.data?.user);

  async function signIn(payload: { email: string; password: string }) {
    const { error } = await authClient.signIn.email(payload);
    if (error) {
      // Handle error, e.g., show a toast
      console.error(error);
      return;
    }
    await init();
    navigateTo("/dashboard");
  }

  async function signUp(payload: { email: string; password: string; name: string }) {
    const { error } = await authClient.signUp.email(payload);
    if (error) {
      // Handle error
      console.error(error);
      return;
    }
    await init();
    navigateTo("/dashboard");
  }

  async function signOut() {
    await authClient.signOut();
    session.value = null;
    navigateTo("/login");
  }

  return {
    session,
    user,
    loading,
    loggedIn,
    init,
    signIn,
    signOut,
    signUp,
  };
});
