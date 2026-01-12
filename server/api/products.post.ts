import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedData = productCreateSchema.parse(body);
  const data = { ...parsedData, price: parsedData.price.toString() };

  // TODO: Add authorization to check if user has access to this company
  const newProduct = await createProduct(data);

  return newProduct;
});
