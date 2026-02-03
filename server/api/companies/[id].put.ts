import { getCompanyById, updateCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyIdParamSchema, companyUpdateSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = companyIdParamSchema.parse(event.context.params);

    const body = await readBody(event);
    const parsedData = companyUpdateSchema.parse(body);

    const userId = event.context.user.id;
    const company = await getCompanyById(id);

    if (!company) {
      throw createError({ statusCode: 404, statusMessage: "Company not found" });
    }

    if (company.user_id !== userId) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden: You don't own this company" });
    }

    const [updatedCompany] = await updateCompany(id, parsedData);
    return updatedCompany;
  }
  catch (error) {
    throw handleError(error, { route: "companies.[id].put", user: event.context.user?.id });
  }
});
