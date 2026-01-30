import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";
import { sendEmail } from "../utils/emailsender";
import { db } from "./db/index";
import { user_schema } from "./db/schema/index";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          from: "techlead@bogdanweb.dev",
          replyTo: "techlead@bogdanweb.dev",
          subject: "Verify your email address",
          text: `Hello, ${user.name}. Thank you for signing up for EscorialCRM. Click the link to verify your email: ${url}`,
        });
      }
      catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
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
    requireEmailVerification: true,
  },
});
