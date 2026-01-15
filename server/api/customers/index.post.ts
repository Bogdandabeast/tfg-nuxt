import { createCustomer } from "~~/lib/db/queries/customers";
import { assertUserHasCompanyAccess } from "~~/utils/company-access";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { customerCreateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  const body = await readBody(event);
  const data = customerCreateSchema.parse(body);

  // Check if user has access to this company
  await assertUserHasCompanyAccess(event.context.user.id, data.company_id);

  const newCustomer = await createCustomer(data);

  return newCustomer;
});
