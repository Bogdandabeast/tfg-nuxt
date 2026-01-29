import type { NewProduct } from "~/types/api";
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { productsTable } from "../schema/companies";

export async function createProduct(data: NewProduct) {
  return db.insert(productsTable).values(data).returning();
}

export async function getProductById(id: string) {
  return db.select().from(productsTable).where(eq(productsTable.id, id));
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
