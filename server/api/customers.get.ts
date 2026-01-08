import { z } from "zod";
import { getCustomersByCompanyId } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const querySchema = z.object({
  company_id: z.coerce.number().int().positive("Company ID must be a positive integer"),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const query = getQuery(event);
  const { company_id } = querySchema.parse(query);

  // TODO: Add authorization to check if user has access to this company
  const customers = await getCustomersByCompanyId(company_id);

  return customers;
});
