import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const parsedData = productCreateSchema.parse(body);
    const data = { ...parsedData, price: parsedData.price.toString() };

    // TODO: Add authorization to check if user has access to this company
    const newProduct = await createProduct(data);

    return newProduct;
  }
  catch (error) {
    throw handleError(error, { route: "products.post", user: event.context.session?.userId });
  }
});
