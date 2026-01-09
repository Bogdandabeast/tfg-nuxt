import { getSalesByCompanyId, getSalesByCustomerId, getSalesByProductId } from "~~/lib/db/queries/sales";
import { companyIdParamSchema, customerIdParamSchema, productIdParamSchema } from "~~/utils/sales.schema";

export default defineEventHandler(async (event) => {
  // Assume company_id is available from authentication middleware

  const query = getQuery(event);

  try {
    // Search by customer_id
    if (query.customer_id && query.company_id) {
      const { customer_id, company_id } = await customerIdParamSchema.parseAsync(query);
      const sales = await getSalesByCustomerId(customer_id, company_id);
      return { sales };
    }

    // Search by product_id
    if (query.product_id && query.company_id) {
      const { product_id, company_id } = await productIdParamSchema.parseAsync(query);
      const sales = await getSalesByProductId(product_id, company_id);
      return { sales };
    }

    // Default: get all sales for the company
    if (query.company_id) {
      const { company_id } = await companyIdParamSchema.parseAsync(query);
      const sales = await getSalesByCompanyId(company_id);
      return { sales };
    }
  }
  catch (error) {
    // Handle validation errors from Zod
    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: error.errors,
      });
    }
    // Handle other potential errors
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
