import { eq } from "drizzle-orm";
import { db } from "../index";
import { user } from "../schema/auth";

export type User = typeof user.$inferInsert;

export async function createUser(data: User) {
  return db.insert(user).values(data).returning();
}

export async function getUserById(id: string) {
  return db.select().from(user).where(eq(user.id, id));
}

export async function updateUser(id: string, data: Partial<User>) {
  return db.update(user).set(data).where(eq(user.id, id)).returning();
}

export async function deleteUser(id: string) {
  return db.delete(user).where(eq(user.id, id)).returning();
}
