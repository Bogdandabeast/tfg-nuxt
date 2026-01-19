import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getTopSellingProducts } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { limitSchema } from "~~/utils/schemas/metrics";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = limitSchema.parse(query.limit);

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const result = await getTopSellingProducts(userCompanyIds, limit);
    return { products: result };
  }
  catch (error) {
    throw handleError(error, { route: "metrics.products.top-selling", user: event.context.user?.id });
  }
});
