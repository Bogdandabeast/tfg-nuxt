import { z } from "zod";
import { createProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  company_id: z.number().int(),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);
  const data = productCreateSchema.parse(body);

  // TODO: Add authorization to check if user has access to this company
  const newProduct = await createProduct(data);

  return newProduct;
});
