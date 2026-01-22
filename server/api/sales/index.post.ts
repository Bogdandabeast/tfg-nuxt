import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createSale } from "~~/lib/db/queries/sales";
import { auditLog, logError } from "~~/server/utils/background";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { createSaleSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const body = await readBody(event);
    const userId = event.context.user.id;
    const validatedData = createSaleSchema.parse(body);

    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    if (!userCompanyIds.includes(validatedData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const newSale = await createSale(validatedData);

    // Audit logging in background
    event.waitUntil(auditLog("Sale created", { saleId: newSale[0]?.id || 0, userId }));

    return { sale: newSale[0] };
  }
  catch (error) {
    // Log error in background
    event.waitUntil(logError(error, "sales.post"));
    throw handleError(error, { route: "sales.post", user: event.context.user?.id });
  }
});
