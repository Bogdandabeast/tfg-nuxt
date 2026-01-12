import { getSaleById } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = saleIdParamSchema.parse(event.context.params);
    const companyId = event.context.session?.company_id;
    if (!companyId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    const sale = await getSaleById(id, companyId);

    if (!sale) {
      throw createError({
        statusCode: 404,
        statusMessage: "Sale not found",
      });
    }
    return { sale };
  }
  catch (error) {
    handleError(error, { route: "sales.[id].get", user: event.context.user?.id });
  }
});
