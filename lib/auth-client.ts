import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],

});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  resetPassword,
} = authClient;
