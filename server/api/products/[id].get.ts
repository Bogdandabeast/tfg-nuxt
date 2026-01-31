import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getProductById } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productIdParamSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = productIdParamSchema.parse(event.context.params);

    const productData = await getProductById(id);
    if (!productData) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    if (!productData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    if (!userCompanyIds.includes(productData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { product: productData };
  }
  catch (error) {
    throw handleError(error, {
      route: "products.[id].get",
      user: event.context.user?.id,
    });
  }
});
