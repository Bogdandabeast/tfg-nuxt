import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { deleteProduct, getProductById } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productIdParamSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id: productId } = productIdParamSchema.parse(event.context.params);

    const product = await getProductById(productId);

    if (!product || !product.length) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    const productData = product[0]!;
    if (!productData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);

    if (!userCompanyIds.includes(productData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    const deleted = await deleteProduct(productId, productData.company_id);

    if (!deleted || deleted.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    return { success: true, id: productId };
  }
  catch (error) {
    // Handle foreign key constraint violation
    if (error && typeof error === "object" && "code" in error && error.code === "23503") {
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict",
        data: "Cannot delete this product because it is currently in use by sales",
      });
    }
    throw handleError(error, { route: "products.[id].delete", user: event.context.user?.id });
  }
});
