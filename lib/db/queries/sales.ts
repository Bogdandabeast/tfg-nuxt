import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { salesTables } from "../schema/companies";

export type SaleInsert = typeof salesTables.$inferInsert;
export type Sale = typeof salesTables.$inferSelect;

export async function createSale(data: SaleInsert) {
  return db.insert(salesTables).values(data).returning();
}

export async function getSaleById(id: number, company_id: number) {
  return db.select().from(salesTables).where(and(eq(salesTables.id, id), eq(salesTables.company_id, company_id)));
}

export async function getSaleByIdOnly(id: number): Promise<Sale | undefined> {
  const rows = await db.select().from(salesTables).where(eq(salesTables.id, id)).limit(1);
  return rows[0];
}

export async function getSalesByCompanyId(company_id: number) {
  return db.select().from(salesTables).where(eq(salesTables.company_id, company_id));
}

export async function getSalesByCustomerId(customer_id: number, company_id: number) {
  return db.select().from(salesTables).where(and(eq(salesTables.customer_id, customer_id), eq(salesTables.company_id, company_id)));
}

export async function getSalesByProductId(product_id: number, company_id: number) {
  return db.select().from(salesTables).where(and(eq(salesTables.product_id, product_id), eq(salesTables.company_id, company_id)));
}

export async function updateSale(id: number, company_id: number, data: Partial<SaleInsert>) {
  return db.update(salesTables).set(data).where(and(eq(salesTables.id, id), eq(salesTables.company_id, company_id))).returning();
}

export async function deleteSale(id: number, company_id: number) {
  return db.delete(salesTables).where(and(eq(salesTables.id, id), eq(salesTables.company_id, company_id))).returning();
}
