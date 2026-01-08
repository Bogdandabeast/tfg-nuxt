import { z } from "zod";
import { updateProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const productUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const productId = Number(event.context.params?.id);
  if (!productId || isNaN(productId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid product ID",
    });
  }

  const body = await readBody(event);
  const data = productUpdateSchema.parse(body);

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
