import type { NewProduct, Product } from "~~/types/api";
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { productsTable } from "../schema/companies";

export type { NewProduct, Product };

export async function createProduct(data: typeof productsTable.$inferInsert) {
  return db.insert(productsTable).values(data).returning();
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  return result[0] || null;
}

export async function getProductsByCompanyId(companyId: string) {
  return db.select().from(productsTable).where(eq(productsTable.company_id, companyId));
}

export async function updateProduct(id: string, data: Partial<NewProduct>) {
  return db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning();
}

export async function deleteProduct(id: string, company_id: string) {
  return db.delete(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.company_id, company_id))).returning();
}
