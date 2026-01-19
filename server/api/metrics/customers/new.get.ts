import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getNewCustomersByPeriod } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { dateRangeSchema } from "~~/utils/schemas/metrics";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { start, end } = dateRangeSchema.parse(query);

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const result = await getNewCustomersByPeriod(userCompanyIds, start, end);
    return { total: result };
  }
  catch (error) {
    throw handleError(error, { route: "metrics.customers.new", user: event.context.user?.id });
  }
});
