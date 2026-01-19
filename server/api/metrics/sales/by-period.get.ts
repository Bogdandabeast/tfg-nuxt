import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getSalesByPeriod } from "~~/lib/db/queries/metrics";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { periodSchema } from "~~/utils/schemas/metrics";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const period = periodSchema.parse(query.period || "monthly");

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    const result = await getSalesByPeriod(userCompanyIds, period);
    return { data: result };
  }
  catch (error) {
    throw handleError(error, { route: "metrics.sales.by-period", user: event.context.user?.id });
  }
});
