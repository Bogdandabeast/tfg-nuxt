import { z } from "zod";
import { getProductsByCompanyId } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const querySchema = z.object({
  company_id: z.coerce.number().int().positive("Company ID must be a positive integer"),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const query = getQuery(event);
  const { company_id } = querySchema.parse(query);

  // TODO: Add authorization to check if user has access to this company
  const products = await getProductsByCompanyId(company_id);

  return products;
});
