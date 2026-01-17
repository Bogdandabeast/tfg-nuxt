import { and, eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { customersTable } from "../schema/companies";
import { getCompaniesByUserId } from "./company";

export type CustomerInsert = typeof customersTable.$inferInsert;
export type Customer = typeof customersTable.$inferSelect;

export async function createCustomer(data: CustomerInsert) {
  return db.insert(customersTable).values(data).returning();
}

export async function getCustomerById(id: number, company_id: number): Promise<Customer | null> {
  const result = await db.select().from(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).limit(1);
  return result[0] || null;
}

export async function findCustomerInUserCompanies(customerId: number, userId: string): Promise<Customer | null> {
  const userCompanies = await getCompaniesByUserId(userId);
  const companyIds = userCompanies.map(c => c.id);
  const result = await db.select().from(customersTable).where(and(eq(customersTable.id, customerId), inArray(customersTable.company_id, companyIds))).limit(1);
  return result[0] || null;
}

export async function getCustomersByCompanyId(companyId: number) {
  return db.select().from(customersTable).where(eq(customersTable.company_id, companyId));
}

export async function updateCustomer(id: number, company_id: number, data: Partial<CustomerInsert>) {
  return db.update(customersTable).set(data).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).returning();
}

export async function deleteCustomer(id: number, company_id: number) {
  return db.delete(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.company_id, company_id))).returning();
}
