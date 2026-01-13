import { createCustomer } from "~~/lib/db/queries/customers";
import { assertUserHasCompanyAccess } from "~~/utils/company-access";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { customerCreateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);
  const data = customerCreateSchema.parse(body);

  // Check if user has access to this company
  await assertUserHasCompanyAccess(event.context.user.id, data.company_id);

  const newCustomer = await createCustomer(data);

  return newCustomer;
});
