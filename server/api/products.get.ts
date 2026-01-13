import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getProductsByCompanyId } from "~~/lib/db/queries/products";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

// const querySchema = z.object({
//   company_id: z.coerce.number().int().positive("Company ID must be a positive integer"),
// });

export default defineAuthenticatedEventHandler(async (event) => {
  const query = getQuery(event);
  // const { company_id } = querySchema.parse(query);
  const company_id = Number(query.company_id); // Temporarily get company_id directly

  // Check if user has access to this company
  const userId = event.context.user.id;
  const userCompanies = await getCompaniesByUserId(userId);
  const userCompanyIds = userCompanies.map(c => c.id);
  if (!userCompanyIds.includes(company_id)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  const products = await getProductsByCompanyId(company_id);

  return products;
});
