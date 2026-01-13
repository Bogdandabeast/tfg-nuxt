import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createSale } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { createSaleSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const { company_id } = body;
    if (!userCompanyIds.includes(company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }
    const validatedData = createSaleSchema.parse({ ...body });

    const newSale = await createSale(validatedData);
    return { sale: newSale };
  }
  catch (error) {
    handleError(error, { route: "sales.post", user: event.context.user?.id });
  }
});
