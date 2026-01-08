import { eq } from "drizzle-orm";
import { db } from "../index";
import { session } from "../schema/auth";

export type Session = typeof session.$inferInsert;

export async function createSession(data: Session) {
  return db.insert(session).values(data).returning();
}

export async function getSessionById(id: string) {
  return db.select().from(session).where(eq(session.id, id));
}

export async function updateSession(id: string, data: Partial<Session>) {
  return db.update(session).set(data).where(eq(session.id, id)).returning();
}

export async function deleteSession(id: string) {
  return db.delete(session).where(eq(session.id, id)).returning();
}
