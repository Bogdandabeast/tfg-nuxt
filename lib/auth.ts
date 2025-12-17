import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db/index";
import { user_schema } from "./db/schema/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: user_schema,

  }),
  emailAndPassword: {
    enabled: true,

  },
});
