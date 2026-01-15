import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { productsTable } from "../schema/companies";

export type Product = typeof productsTable.$inferInsert;

export async function createProduct(data: Product) {
  return db.insert(productsTable).values(data).returning();
}

export async function getProductById(id: number) {
  return db.select().from(productsTable).where(eq(productsTable.id, id));
}

export async function getProductsByCompanyId(companyId: number) {
  return db.select().from(productsTable).where(eq(productsTable.company_id, companyId));
}

export async function updateProduct(id: number, data: Partial<Product>) {
  return db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning();
}

export async function deleteProduct(id: number, company_id: number) {
  return db.delete(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.company_id, company_id))).returning();
}
