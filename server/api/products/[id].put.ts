import { updateProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { productIdParamSchema, productUpdateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  const { id: productId } = productIdParamSchema.parse(event.context.params);

  const body = await readBody(event);
  const data = productUpdateSchema.parse(body);
  if (data.price !== undefined) {
    data.price = data.price.toString();
  }

  // TODO: Add authorization to check if user has access to this product
  const updated = await updateProduct(productId, data);

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  return updated;
});
