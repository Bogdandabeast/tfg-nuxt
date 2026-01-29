import { deleteCompany, getCompaniesByUserId } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyIdParamSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = companyIdParamSchema.parse(event.context.params);

    const companies = await getCompaniesByUserId(event.context.user.id);
    const company = companies.find(c => c.id === id);

    if (!company) {
      throw createError({ statusCode: 404, statusMessage: "Company not found" });
    }

    await deleteCompany(id);
    return { success: true };
  }
  catch (error) {
    throw handleError(error, { route: "companies.[id].delete", user: event.context.user?.id });
  }
});
