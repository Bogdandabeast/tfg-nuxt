import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";
import { db } from "./db/index";
import { user_schema } from "./db/schema/index";
import { SendEmail } from "./emailsender";

export type UserWithId = Omit<User, "id"> & {
  id: string;
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "https://bogdanweb.dev",
    "http://localhost:3000",
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void SendEmail({
        to: user.email,
        from: "techlead@bogdanweb.dev",
        replyTo: "techlead@bogdanweb.dev",
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
    sendOnSignUp: true, // Enviar automáticamente al registrarse
    sendOnSignIn: true, // Enviar automáticamente al iniciar sesión si no está verificado
    autoSignInAfterVerification: true, // Auto login después de verificar
    expiresIn: 3600, // Token expira en 1 hora
  },
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          secure: true,
          sameSite: "none",
          path: "/",
          domain: "bogdanweb.dev",
        },
      },
    },
    disableCSRFCheck: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/get-session") {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
        return ctx.json(ctx.context.session);
      }
      return ctx;
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: user_schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Requiere verificación para login
  },
});
