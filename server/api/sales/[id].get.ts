import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getSaleByIdOnly } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { saleIdParamSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = saleIdParamSchema.parse(event.context.params);

    const saleData = await getSaleByIdOnly(id);
    if (!saleData || !saleData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);
    if (!userCompanyIds.includes(saleData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { sale: saleData };
  }
  catch (error) {
    throw handleError(error, { route: "sales.[id].get", user: event.context.user?.id });
  }
});
