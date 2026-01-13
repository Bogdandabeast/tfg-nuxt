import verifyCsrf from "nuxt-csurf";
import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    // @ts-expect-error nuxt-csurf type issue
    verifyCsrf(event, { headerName: "csrf-token" });
    const body = await readBody(event);
    const parsedData = productCreateSchema.parse(body);
    const data = { ...parsedData, price: parsedData.price.toString() };

    // Check if user has access to the provided company_id
    const userId = event.context.user?.id;
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    const { getCompaniesByUserId } = await import("~~/lib/db/queries/company");
    const userCompanies = await getCompaniesByUserId(userId);
    const hasAccess = userCompanies.some(company => company.id === parsedData.company_id);
    if (!hasAccess) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const newProduct = await createProduct(data);

    return newProduct;
  }
  catch (error) {
    throw handleError(error, { route: "products.post", user: event.context.user?.id });
  }
});
