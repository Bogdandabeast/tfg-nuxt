import { deleteSale } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = saleIdParamSchema.parse(event.context.params);
    const companyId = event.context.user?.company_id;
    if (!companyId || Number.isNaN(Number(companyId))) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Invalid company context",
      });
    }
    const deletedSale = await deleteSale(id, companyId);
    const deletedSale = await deleteSale(id, companyId);

    if (!deletedSale) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sale not found or not authorized to delete",
      });
    }
    return { message: "Sale deleted successfully" };
  }
  catch (error) {
    handleError(error, { route: "sales.[id].delete", user: event.context.user?.id });
  }
});
