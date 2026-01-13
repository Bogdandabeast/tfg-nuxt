import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getSalesByCompanyId, getSalesByCustomerId, getSalesByProductId } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyIdParamSchema, customerIdParamSchema, productIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id;
  const userCompanies = await getCompaniesByUserId(userId);
  const userCompanyIds = userCompanies.map(c => c.id);

  const query = getQuery(event);

  try {
    // Search by customer_id
    if (query.customer_id && query.company_id) {
      const { customer_id, company_id } = await customerIdParamSchema.parseAsync(query);
      if (!userCompanyIds.includes(company_id)) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
      }
      const sales = await getSalesByCustomerId(customer_id, company_id);
      return { sales };
    }

    // Search by product_id
    if (query.product_id && query.company_id) {
      const { product_id, company_id } = await productIdParamSchema.parseAsync(query);
      if (!userCompanyIds.includes(company_id)) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
      }
      const sales = await getSalesByProductId(product_id, company_id);
      return { sales };
    }

    // Default: get all sales for the company
    if (query.company_id) {
      const { company_id } = await companyIdParamSchema.parseAsync(query);
      if (!userCompanyIds.includes(company_id)) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
      }
      const sales = await getSalesByCompanyId(company_id);
      return { sales };
    }
    else {
      // If no company_id, return for all user's companies
      const allSales = [];
      for (const companyId of userCompanyIds) {
        const sales = await getSalesByCompanyId(companyId);
        allSales.push(...sales);
      }
      return { sales: allSales };
    }
  }
  catch (error) {
    handleError(error, { route: "sales.get", user: event.context.session?.userId });
  }
});
