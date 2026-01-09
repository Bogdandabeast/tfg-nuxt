import { createSale } from "~~/lib/db/queries/sales";
import { createSaleSchema } from "~~/utils/sales.schema";

export default defineEventHandler(async (event) => {
  // Assume company_id is available from authentication middleware
  const companyId = event.context.user?.company_id;
  if (!companyId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const body = await readBody(event);
    const validatedData = await createSaleSchema.parseAsync({ ...body, company_id: companyId });

    const newSale = await createSale(validatedData);
    return { sale: newSale };
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
