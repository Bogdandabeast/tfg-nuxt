import { eq } from "drizzle-orm";
import { db } from "../index";
import { customersTable } from "../schema/companies";

export type CustomerInsert = typeof customersTable.$inferInsert;
export type Customer = typeof customersTable.$inferSelect;

export async function createCustomer(data: CustomerInsert) {
  return db.insert(customersTable).values(data).returning();
}

export async function getCustomerById(id: number) {
  return db.select().from(customersTable).where(eq(customersTable.id, id));
}

export async function getCustomersByCompanyId(companyId: number) {
  return db.select().from(customersTable).where(eq(customersTable.company_id, companyId));
}

export async function updateCustomer(id: number, data: Partial<CustomerInsert>) {
  return db.update(customersTable).set(data).where(eq(customersTable.id, id)).returning();
}

export async function deleteCustomer(id: number) {
  return db.delete(customersTable).where(eq(customersTable.id, id)).returning();
}
