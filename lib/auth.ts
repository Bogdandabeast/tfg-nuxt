import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";

import { db } from "./db/index";
import { user_schema } from "./db/schema/index";

export type UserWithId = Omit<User, "id"> & {
  id: string;
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "https://bogdanweb.dev",
    "http://localhost:3000",
  ],
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
  },
});
