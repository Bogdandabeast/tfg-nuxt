import { getCompanyById } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyIdParamSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = companyIdParamSchema.parse(event.context.params);

    const company = await getCompanyById(id);
    if (!company) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const userId = event.context.user.id;
    if (company.user_id !== userId) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { company };
  }
  catch (error) {
    throw handleError(error, { route: "companies.[id].get", user: event.context.user?.id });
  }
});
