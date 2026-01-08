import { z } from "zod";
import { createCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const companyCreateSchema = z.object({
  name: z.string().min(1, "Company name is required"),
});

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
