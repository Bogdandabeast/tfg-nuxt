import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getProductById, updateProduct } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { productCreateSchema } from "~~/utils/schemas/products";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = event.context.params as { id: string };

    const body = await readBody(event);
    const parsedData = productCreateSchema.partial().parse(body);
    const data = { ...parsedData, price: parsedData.price ? parsedData.price.toString() : undefined };

    const product = await getProductById(Number(id));
    if (!product || !product.length) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    const productData = product[0]!;
    if (!productData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    const userCompanies = await getCompaniesByUserId(event.context.user.id);
    const userCompanyIds = userCompanies.map(c => c.id);
    if (!userCompanyIds.includes(productData!.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const updatedProduct = await updateProduct(Number(id), data);
    return updatedProduct;
  }
  catch (error) {
    throw handleError(error, { route: "products.[id].put", user: event.context.user?.id });
  }
});
