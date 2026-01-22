import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export function createDbClient() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
}

// For backward compatibility, export a default instance
export const db = createDbClient();
