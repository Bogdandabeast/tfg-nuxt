import type { companiesTable } from "../schema/companies";

export type CompanyInsert = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;
