import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const body = await readBody(event);
    const parsedData = productCreateSchema.parse(body);
    const data = { ...parsedData };

    // Check if user has access to the provided company_id
    const userCompanies = await getCompaniesByUserId(event.context.user.id);
    const hasAccess = userCompanies.some(company => company.id === parsedData.company_id);
    if (!hasAccess) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const [product] = await createProduct(data);

    return product;
  }
  catch (error) {
    throw handleError(error, { route: "products.post", user: event.context.user?.id });
  }
});
