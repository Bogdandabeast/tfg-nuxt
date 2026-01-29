import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { productsTable } from "../schema/companies";

export type Product = typeof productsTable.$inferInsert;

export async function createProduct(data: Product) {
  return db.insert(productsTable).values(data).returning();
}

export async function getProductById(id: string) {
  return db.select().from(productsTable).where(eq(productsTable.id, id));
}

export async function getProductsByCompanyId(companyId: string) {
  return db.select().from(productsTable).where(eq(productsTable.company_id, companyId));
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning();
}

export async function deleteProduct(id: string, company_id: string) {
  return db.delete(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.company_id, company_id))).returning();
}
