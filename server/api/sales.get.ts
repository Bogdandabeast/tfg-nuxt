import { getSalesByCompanyId, getSalesByCustomerId, getSalesByProductId } from "~~/lib/db/queries/sales";
import { companyIdParamSchema, customerIdParamSchema, productIdParamSchema } from "~~/utils/sales.schema";

export default defineEventHandler(async (event) => {
  // Assume company_id is available from authentication middleware
  const companyId = event.context.user?.company_id; 
  if (!companyId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const query = getQuery(event);

  try {
    // Search by customer_id
    if (query.customer_id) {
      const { customer_id } = await customerIdParamSchema.parseAsync(query);
      const sales = await getSalesByCustomerId(customer_id, companyId);
      return { sales };
    }

    // Search by product_id
    if (query.product_id) {
      const { product_id } = await productIdParamSchema.parseAsync(query);
      const sales = await getSalesByProductId(product_id, companyId);
      return { sales };
    }

    // Default: get all sales for the company
    const sales = await getSalesByCompanyId(companyId);
    return { sales };

  } catch (error) {
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
