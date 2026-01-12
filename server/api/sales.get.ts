import { getSalesByCompanyId, getSalesByCustomerId, getSalesByProductId } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyIdParamSchema, customerIdParamSchema, productIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  const userCompanyId = event.context.user?.company_id;
  if (!userCompanyId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const query = getQuery(event);

  try {
    // Search by customer_id
    if (query.customer_id && query.company_id) {
      const { customer_id, company_id } = await customerIdParamSchema.parseAsync(query);
      if (company_id !== userCompanyId) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
      const sales = await getSalesByCustomerId(customer_id, company_id);
      return { sales };
    }

    // Search by product_id
    if (query.product_id && query.company_id) {
      const { product_id, company_id } = await productIdParamSchema.parseAsync(query);
      if (company_id !== userCompanyId) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
      const sales = await getSalesByProductId(product_id, company_id);
      return { sales };
    }

    // Default: get all sales for the company
    if (query.company_id) {
      const { company_id } = await companyIdParamSchema.parseAsync(query);
      if (company_id !== userCompanyId) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
      const sales = await getSalesByCompanyId(company_id);
      return { sales };
    }
  }
  catch (error) {
    handleError(error, { route: "sales.get", user: event.context.user?.id });
  }
});
