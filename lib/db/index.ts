import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

const isProd = process.env.NODE_ENV === "production";

config({ path: ".env" }); // or .env.local

const sql = neon(
  isProd ? process.env.DATABASE_URL : process.env.DATABASE_URL_LOCAL,
);
export const db = drizzle({ client: sql });
