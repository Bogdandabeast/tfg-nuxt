import { getProductById } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const productId = Number(event.context.params?.id);

  if (!productId || isNaN(productId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid product ID",
    });
  }

  // TODO: Add authorization to check if user has access to this product
  const product = await getProductById(productId);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  return product;
});
