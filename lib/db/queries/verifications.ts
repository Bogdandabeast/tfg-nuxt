import { eq } from "drizzle-orm";
import { db } from "../index";
import { verification } from "../schema/auth";

export type Verification = typeof verification.$inferInsert;

export async function createVerification(data: Verification) {
  return db.insert(verification).values(data).returning();
}

export async function getVerificationById(id: string) {
  return db.select().from(verification).where(eq(verification.id, id));
}

export async function updateVerification(id: string, data: Partial<Verification>) {
  return db.update(verification).set(data).where(eq(verification.id, id)).returning();
}

export async function deleteVerification(id: string) {
  return db.delete(verification).where(eq(verification.id, id)).returning();
}
