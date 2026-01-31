import type { NewSale, Sale } from "~~/types/api";
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { salesTable } from "../schema/companies";

export async function createSale(data: typeof salesTable.$inferInsert) {
  return db.insert(salesTable).values(data).returning();
}

export async function getSaleById(id: string, company_id: string): Promise<Sale | null> {
  const result = await db.select().from(salesTable).where(and(eq(salesTable.id, id), eq(salesTable.company_id, company_id))).limit(1);
  return result[0] ?? null;
}

export async function getSaleByIdOnly(id: string): Promise<Sale | null> {
  const rows = await db.select().from(salesTable).where(eq(salesTable.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getSalesByCompanyId(company_id: string) {
  return db.select().from(salesTable).where(eq(salesTable.company_id, company_id));
}

export async function getSalesByCustomerId(customer_id: string, company_id: string) {
  return db.select().from(salesTable).where(and(eq(salesTable.customer_id, customer_id), eq(salesTable.company_id, company_id)));
}

export async function getSalesByProductId(product_id: string, company_id: string) {
  return db.select().from(salesTable).where(and(eq(salesTable.product_id, product_id), eq(salesTable.company_id, company_id)));
}

export async function updateSale(id: string, company_id: string, data: Partial<NewSale>) {
  return db.update(salesTable).set(data).where(and(eq(salesTable.id, id), eq(salesTable.company_id, company_id))).returning();
}

export async function deleteSale(id: string, company_id: string) {
  return db.delete(salesTable).where(and(eq(salesTable.id, id), eq(salesTable.company_id, company_id))).returning();
}
