import { eq } from "drizzle-orm";
import { db } from "../index";
import { salesTables } from "../schema/companies";

export type Sale = typeof salesTables.$inferInsert;

export async function createSale(data: Sale) {
  return db.insert(salesTables).values(data).returning();
}

export async function getSaleById(id: number) {
  return db.select().from(salesTables).where(eq(salesTables.id, id));
}

export async function updateSale(id: number, data: Partial<Sale>) {
  return db.update(salesTables).set(data).where(eq(salesTables.id, id)).returning();
}

export async function deleteSale(id: number) {
  return db.delete(salesTables).where(eq(salesTables.id, id)).returning();
}
