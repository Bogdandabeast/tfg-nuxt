import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { customerCreateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);
  const data = customerCreateSchema.parse(body);

  // Check if user has access to this company
  const userId = event.context.user.id;
  const userCompanies = await getCompaniesByUserId(userId);
  const userCompanyIds = userCompanies.map(c => c.id);
  if (!userCompanyIds.includes(data.company_id)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const newCustomer = await createCustomer(data);

  return newCustomer;
});
