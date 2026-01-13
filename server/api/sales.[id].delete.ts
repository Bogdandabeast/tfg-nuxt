import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { deleteSale, getSaleByIdOnly } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = saleIdParamSchema.parse(event.context.params);

    // Get the sale to check ownership
    const saleData = await getSaleByIdOnly(id);
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

    const deletedSale = await deleteSale(id, saleData.company_id);

    if (!deletedSale) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sale not found or not authorized to delete",
      });
    }
    return { message: "Sale deleted successfully" };
  }
  catch (error) {
    throw handleError(error, { route: "sales.[id].delete", user: event.context.user?.id });
  }
});
