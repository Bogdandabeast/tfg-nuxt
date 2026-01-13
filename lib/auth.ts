import type { User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";

import { eq } from "drizzle-orm";

import { db } from "./db/index";
import { companiesTable } from "./db/schema/companies";
import { user_schema } from "./db/schema/index";

export type UserWithId = Omit<User, "id"> & {
  id: string;
};

export const auth = betterAuth({
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
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const company = await db.select({ id: companiesTable.id }).from(companiesTable).where(eq(companiesTable.user_id, session.userId)).limit(1);
            return {
              data: {
                ...session,
                company_id: company[0]?.id || null,
              },
            };
          }
          catch (error) {
            console.error("Error fetching company for session:", error, { userId: session.userId });
            return {
              data: {
                ...session,
                company_id: null,
              },
            };
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,

  },
});
