import { z } from "zod";
import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getAverageTicket, getNewCustomersByPeriod, getSalesByPeriod, getTopSellingProducts, getTotalCustomers, getTotalRevenue } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { dateRangeSchema, limitSchema, periodSchema } from "~~/utils/schemas/metrics";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyIdSchema = z.string().uuid();
    const companyId = companyIdSchema.parse(query.company_id);
    const period = periodSchema.parse(query.period || "monthly");
    const topLimit = limitSchema.parse(query.limit || 5);
    const dateRange = query.start && query.end
      ? dateRangeSchema.parse({ start: query.start, end: query.end })
      : null;

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);

    // Validar que la empresa pertenece al usuario
    if (!userCompanies.find(c => c.id === companyId)) {
      throw createError({ statusCode: 403, statusMessage: "Invalid company access" });
    }

    const targetCompanyIds = [companyId];

    // Ejecutar todas las métricas en paralelo con manejo de errores
    const results = await Promise.allSettled([
      getTotalRevenue(targetCompanyIds),
      getTotalCustomers(targetCompanyIds),
      dateRange
        ? getNewCustomersByPeriod(targetCompanyIds, dateRange.start, dateRange.end)
        : Promise.resolve({ total: 0 }),
      getAverageTicket(targetCompanyIds),
      getTopSellingProducts(targetCompanyIds, topLimit),
      getSalesByPeriod(targetCompanyIds, period),
    ]);

    // Procesar resultados
    const [revenue, customers, newCustomers, avgTicket, topProducts, salesPeriod] = results;

    const response = {
      revenue: {
        total: revenue.status === "fulfilled" ? revenue.value : 0,
        error: revenue.status === "rejected" ? (revenue.reason?.message || String(revenue.reason)) : null,
      },
      customers: {
        total: customers.status === "fulfilled" ? customers.value : 0,
        new: newCustomers.status === "fulfilled" ? newCustomers.value.total : 0,
        error: customers.status === "rejected" ? (customers.reason?.message || String(customers.reason)) : null,
      },
      sales: {
        averageTicket: avgTicket.status === "fulfilled" ? avgTicket.value : 0,
        byPeriod: salesPeriod.status === "fulfilled" ? salesPeriod.value : [],
        totalCount: salesPeriod.status === "fulfilled"
          ? salesPeriod.value.reduce((sum, period) => sum + (period.totalSales || 0), 0)
          : 0,
        error: salesPeriod.status === "rejected" ? (salesPeriod.reason?.message || String(salesPeriod.reason)) : null,
      },
      products: {
        topSelling: topProducts.status === "fulfilled" ? topProducts.value : [],
        error: topProducts.status === "rejected" ? (topProducts.reason?.message || String(topProducts.reason)) : null,
      },
    };

    return response;
  }
  catch (error) {
    throw handleError(error, { route: "metrics.dashboard", user: event.context.user?.id });
  }
});
