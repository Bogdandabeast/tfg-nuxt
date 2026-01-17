import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getCustomerById, updateCustomer } from "~~/lib/db/queries/customers";
import type { Customer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerCreateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = event.context.params as { id: string };

    const body = await readBody(event);
    const parsedData = customerCreateSchema.partial().parse(body);

    const userCompanies = await getCompaniesByUserId(event.context.user.id);
    const userCompanyIds = userCompanies.map(c => c.id);

    let customer: Customer | null = null;
    for (const companyId of userCompanyIds) {
      customer = await getCustomerById(Number(id), companyId);
      if (customer) break;
    }
    if (!customer) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    const updatedCustomer = await updateCustomer(Number(id), parsedData);
    return updatedCustomer;
  }
  catch (error) {
    throw handleError(error, { route: "customers.[id].put", user: event.context.user?.id });
  }
});
