import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const parsedData = productCreateSchema.parse(body);
    const data = { ...parsedData, price: parsedData.price.toString() };

    // Check if user has access to the provided company_id
    const userId = event.context.user?.id;
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
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
