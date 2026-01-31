import { eq } from "drizzle-orm";
import { db } from "../index";
import { companiesTable } from "../schema/companies";

export async function createCompany(data: typeof companiesTable.$inferInsert) {
  return db.insert(companiesTable).values(data).returning();
}

export async function getCompaniesByUserId(userId: string) {
  return db.select().from(companiesTable).where(eq(companiesTable.user_id, userId));
}

export async function updateCompany(id: string, data: typeof companiesTable.$inferUpdate) {
  return db.update(companiesTable).set(data).where(eq(companiesTable.id, id)).returning();
}

export async function deleteCompany(id: string) {
  return db.delete(companiesTable).where(eq(companiesTable.id, id)).returning();
}
