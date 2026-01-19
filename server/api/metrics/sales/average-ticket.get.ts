import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getAverageTicket } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const result = await getAverageTicket(userCompanyIds);
    return { average: result };
  }
  catch (error) {
    throw handleError(error, { route: "metrics.sales.average-ticket", user: event.context.user?.id });
  }
});
