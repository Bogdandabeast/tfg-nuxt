import { createCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { companyCreateSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { user } = event.context;
    const body = await readBody(event);

    const { name } = companyCreateSchema.parse(body);

    const newCompany = await createCompany({
      name,
      user_id: user.id.toString(),
    });

    return newCompany;
  }
  catch (error) {
    throw handleError(error, { route: "companies.post", user: event.context.user?.id });
  }
});
