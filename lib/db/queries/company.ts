import type { CompanyInsert } from "./companies";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { companiesTable } from "../schema/companies";

export async function createCompany(data: CompanyInsert) {
  return db.insert(companiesTable).values(data).returning();
}

export async function getCompanyById(id: number) {
  return db.select().from(companiesTable).where(eq(companiesTable.id, id));
}

export async function getCompaniesByUserId(userId: string) {
  return db.select().from(companiesTable).where(eq(companiesTable.user_id, userId));
}

export async function updateCompany(id: number, data: Partial<CompanyInsert>) {
  return db.update(companiesTable).set(data).where(eq(companiesTable.id, id)).returning();
}

export async function deleteCompany(id: number) {
  return db.delete(companiesTable).where(eq(companiesTable.id, id)).returning();
}
