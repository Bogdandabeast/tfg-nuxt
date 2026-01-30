import type { Customer, NewCustomer } from "~~/types/api";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { customersTable } from "../schema/companies";
import { getCompaniesByUserId } from "./company";

export type { Customer, NewCustomer };

export async function createCustomer(data: typeof customersTable.$inferInsert) {
  return db.insert(customersTable).values(data).returning();
}

export async function getCustomerById(id: string, company_id: string): Promise<Customer | null> {
  const result = await db.select().from(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).limit(1);
  return result[0] || null;
}

export async function findCustomerInUserCompanies(customerId: string, userId: string): Promise<Customer | null> {
  const userCompanies = await getCompaniesByUserId(userId);
  const companyIds = userCompanies.map(c => c.id);
  if (companyIds.length === 0)
    return null;
  const result = await db.select().from(customersTable).where(and(eq(customersTable.id, customerId), inArray(customersTable.company_id, companyIds))).limit(1);
  return result[0] || null;
}

export async function getCustomersByCompanyId(companyId: string) {
  return db.select().from(customersTable).where(eq(customersTable.company_id, companyId));
}

export async function updateCustomer(id: string, company_id: string, data: Partial<NewCustomer>) {
  return db.update(customersTable).set(data).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).returning();
}

export async function deleteCustomer(id: string, company_id: string) {
  return db.delete(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).returning();
}
