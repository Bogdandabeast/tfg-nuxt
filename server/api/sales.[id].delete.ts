import { deleteSale } from "~~/lib/db/queries/sales";
import { saleIdParamSchema } from "~~/utils/sales.schema";

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
    const { id } = await saleIdParamSchema.parseAsync(event.context.params);
    const deletedSale = await deleteSale(id, companyId);

    if (!deletedSale) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sale not found or not authorized to delete",
      });
    }
    return { message: "Sale deleted successfully" };
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
