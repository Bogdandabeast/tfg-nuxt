import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getSaleByIdOnly, updateSale } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema, updateSaleSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validar CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = await saleIdParamSchema.parseAsync(event.context.params);

    // Get the sale to check ownership
    const sale = await getSaleByIdOnly(id);
    const saleData = sale[0];
    if (!saleData || !saleData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    // Check if user has access to the sale's company
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);
    if (!userCompanyIds.includes(saleData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const body = await readBody(event);
    const validatedData = await updateSaleSchema.parseAsync(body);

    const updatedSale = await updateSale(id, saleData.company_id, validatedData);

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
