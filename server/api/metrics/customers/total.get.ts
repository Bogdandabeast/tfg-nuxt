import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getTotalCustomers } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const result = await getTotalCustomers(userCompanyIds);
    return { total: result };
  }
  catch (error) {
    throw handleError(error, { route: "metrics.customers.total", user: event.context.user?.id });
  }
});