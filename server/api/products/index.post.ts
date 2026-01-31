import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const body = await readBody(event);
    const parsedData = productCreateSchema.parse(body);

    const companies = await getCompaniesByUserId(event.context.user.id);
    const userCompanyIds = companies.map(c => c.id);

    if (!parsedData.company_id || !userCompanyIds.includes(parsedData.company_id)) {
      throw createError({
        statusCode: 403,
        statusMessage: "You do not have permission to create products for this company",
      });
    }

    const data = {
      ...parsedData,
      price: String(parsedData.price),
      company_id: parsedData.company_id,
    };

    const [product] = await createProduct(data);

    return product;
  }
  catch (error) {
    throw handleError(error, { route: "products.post", user: event.context.user?.id });
  }
});
