import { createCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { companyCreateSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  const { user } = event.context;
  const body = await readBody(event);

  const { name } = companyCreateSchema.parse(body);

  const newCompany = await createCompany({
    name,
    user_id: user.id,
  });

  return newCompany;
});
