import { eq } from "drizzle-orm";
import { db } from "../index";
import { account } from "../schema/auth";

export type Account = typeof account.$inferInsert;

export async function createAccount(data: Account) {
  return db.insert(account).values(data).returning();
}

export async function getAccountById(id: string) {
  return db.select().from(account).where(eq(account.id, id));
}

export async function updateAccount(id: string, data: Partial<Account>) {
  return db.update(account).set(data).where(eq(account.id, id)).returning();
}

export async function deleteAccount(id: string) {
  return db.delete(account).where(eq(account.id, id)).returning();
}
