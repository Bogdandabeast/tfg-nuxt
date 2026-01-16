import { getCompanyById } from "~~/lib/db/queries/companies";
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

    const companyData = company;

    // Check if user owns the company
    const userId = event.context.user.id;
    if (companyData.user_id !== userId) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { company: companyData };
  }
  catch (error) {
    throw handleError(error, { route: "companies.[id].get", user: event.context.user?.id });
  }
});
