import { updateSale } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema, updateSaleSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validar CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }
  // Assume company_id is available from authentication middleware
  const companyId = event.context.session?.company_id;
  if (!companyId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden: No associated company",
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
    throw handleError(error, { route: "sales.[id].put", user: event.context.session?.userId });
  }
});
