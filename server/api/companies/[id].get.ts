import { getCompanyById } from "~~/lib/db/queries/company";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const companyId = Number(event.context.params?.id);

  if (!companyId || Number.isNaN(companyId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid company ID",
    });
  }

  // TODO: Add authorization to check if user has access to this company
  const company = await getCompanyById(companyId);

  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: "Company not found",
    });
  }

  return company;
});
