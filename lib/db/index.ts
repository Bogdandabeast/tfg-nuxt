import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// const isProd = process.env.NODE_ENV === "production";

config({ path: ".env" });

const pool = new Pool({
  // eslint-disable-next-line node/no-process-env
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
