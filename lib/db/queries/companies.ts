import { eq } from "drizzle-orm";
import { db } from "../index";
import { companiesTable } from "../schema/companies";

export type CompanyInsert = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;

export async function getCompanyById(id: string): Promise<Company | null> {
  const result = await db.select().from(companiesTable).where(eq(companiesTable.id, id)).limit(1);
  return result[0] || null;
}
