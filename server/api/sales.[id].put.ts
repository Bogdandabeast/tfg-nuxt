import { updateSale } from "~~/lib/db/queries/sales";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema, updateSaleSchema } from "~~/utils/schemas/sales";

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
    const body = await readBody(event);
    const validatedData = await updateSaleSchema.parseAsync(body);

    const updatedSale = await updateSale(id, companyId, validatedData);

    if (!updatedSale) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sale not found or not authorized to update",
      });
    }
    return { sale: updatedSale };
  }
  catch (error) {
    handleError(error, { route: "sales.[id].put", user: event.context.user?.id });
  }
});
