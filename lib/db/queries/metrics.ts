import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "../index";
import { customersTable, productsTable, salesTable } from "../schema/companies";

export async function getTotalRevenue(userCompanyIds: string[]) {
  const result = await db
    .select({
      total: sql<number>`SUM(${productsTable.price} * ${salesTable.quantity})`,
    })
    .from(salesTable)
    .innerJoin(productsTable, eq(salesTable.product_id, productsTable.id))
    .where(inArray(salesTable.company_id, userCompanyIds));

  return result[0]?.total || 0;
}

export async function getTotalCustomers(userCompanyIds: string[]) {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customersTable)
    .where(inArray(customersTable.company_id, userCompanyIds));

  return result[0]?.count || 0;
}

export async function getNewCustomersByPeriod(userCompanyIds: string[], startDate: Date, endDate: Date) {
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

export async function getAverageTicket(userCompanyIds: string[]) {
  const revenue = await getTotalRevenue(userCompanyIds);
  const salesCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(salesTable)
    .where(inArray(salesTable.company_id, userCompanyIds));

  return salesCount[0]?.count ? revenue / salesCount[0].count : 0;
}

export async function getTopSellingProducts(userCompanyIds: string[], limit: number = 10) {
  return await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      totalSold: sql<number>`SUM(${salesTable.quantity})`,
    })
    .from(salesTable)
    .innerJoin(productsTable, eq(salesTable.product_id, productsTable.id))
    .where(inArray(salesTable.company_id, userCompanyIds))
    .groupBy(productsTable.id, productsTable.name)
    .orderBy(desc(sql`SUM(${salesTable.quantity})`))
    .limit(limit);
}

export async function getSalesByPeriod(userCompanyIds: string[], period: "daily" | "weekly" | "monthly") {
  let dateFormat: string;
  switch (period) {
    case "daily": dateFormat = "DATE(sale_date)"; break;
    case "weekly": dateFormat = "DATE_TRUNC('week', sale_date)"; break;
    case "monthly": dateFormat = "DATE_TRUNC('month', sale_date)"; break;
  }

  return await db
    .select({
      period: sql<string>`${dateFormat}`,
      totalSales: sql<number>`COUNT(*)`,
      totalRevenue: sql<number>`SUM(${productsTable.price} * ${salesTable.quantity})`,
    })
    .from(salesTable)
    .innerJoin(productsTable, eq(salesTable.product_id, productsTable.id))
    .where(inArray(salesTable.company_id, userCompanyIds))
    .groupBy(sql`${dateFormat}`)
    .orderBy(sql`${dateFormat}`);
}
