import { updateCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { companyIdParamSchema, companyUpdateSchema } from "~~/utils/schemas/companies";

export default defineAuthenticatedEventHandler(async (event) => {
  const { id: companyId } = companyIdParamSchema.parse(event.context.params);

  const body = await readBody(event);
  const { name } = companyUpdateSchema.parse(body);

  // TODO: Add authorization to check if user has access to this company
  const updated = await updateCompany(companyId, { name });

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "Company not found",
    });
  }

  return updated;
});
