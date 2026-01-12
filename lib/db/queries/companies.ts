import { companiesTable } from "../schema/companies";

export type Company = typeof companiesTable.$inferInsert;
