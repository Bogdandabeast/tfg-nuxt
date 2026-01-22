import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "../index";
import { customersTable, productsTable, salesTables } from "../schema/companies";

export async function getTotalRevenue(userCompanyIds: number[]) {
  const result = await db
    .select({
      total: sql<number>`SUM(${productsTable.price} * ${salesTables.quantity})`,
    })
    .from(salesTables)
    .innerJoin(productsTable, eq(salesTables.product_id, productsTable.id))
    .where(inArray(salesTables.company_id, userCompanyIds));

  return result[0]?.total || 0;
}

export async function getTotalCustomers(userCompanyIds: number[]) {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customersTable)
    .where(inArray(customersTable.company_id, userCompanyIds));

  return result[0]?.count || 0;
}

export async function getNewCustomersByPeriod(userCompanyIds: number[], startDate: Date, endDate: Date) {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customersTable)
    .where(and(
      inArray(customersTable.company_id, userCompanyIds),
      gte(customersTable.created_at, startDate),
      lte(customersTable.created_at, endDate),
    ));

  return result[0]?.count || 0;
}

export async function getAverageTicket(userCompanyIds: number[]) {
  const revenue = await getTotalRevenue(userCompanyIds);
  const salesCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(salesTables)
    .where(inArray(salesTables.company_id, userCompanyIds));

  return salesCount[0]?.count ? revenue / salesCount[0].count : 0;
}

export async function getTopSellingProducts(userCompanyIds: number[], limit: number = 10) {
  return await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      totalSold: sql<number>`SUM(${salesTables.quantity})`,
    })
    .from(salesTables)
    .innerJoin(productsTable, eq(salesTables.product_id, productsTable.id))
    .where(inArray(salesTables.company_id, userCompanyIds))
    .groupBy(productsTable.id, productsTable.name)
    .orderBy(desc(sql`SUM(${salesTables.quantity})`))
    .limit(limit);
}

export async function getSalesByPeriod(userCompanyIds: number[], period: "daily" | "weekly" | "monthly") {
  let dateFormat: string;
  switch (period) {
    case "daily":
      dateFormat = "DATE(sale_date)";
      break;
    case "weekly":
      dateFormat = "DATE_TRUNC('week', sale_date)";
      break;
    case "monthly":
      dateFormat = "DATE_TRUNC('month', sale_date)";
      break;
  }

  return await db
    .select({
      period: sql<string>`${dateFormat}`,
      totalSales: sql<number>`COUNT(*)`,
      totalRevenue: sql<number>`SUM(${productsTable.price} * ${salesTables.quantity})`,
    })
    .from(salesTables)
    .innerJoin(productsTable, eq(salesTables.product_id, productsTable.id))
    .where(inArray(salesTables.company_id, userCompanyIds))
    .groupBy(sql`${dateFormat}`)
    .orderBy(sql`${dateFormat}`);
}
