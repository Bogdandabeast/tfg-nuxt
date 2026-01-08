import { z } from "zod";
import { updateCompany } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const companyUpdateSchema = z.object({
  name: z.string().min(1, "Company name is required"),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const companyId = Number(event.context.params?.id);
  if (!companyId || Number.isNaN(companyId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid company ID",
    });
  }

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
