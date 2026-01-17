import { findCustomerInUserCompanies, updateCustomer } from "~~/lib/db/queries/customers";
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

    const userId = event.context.user.id;
    const customer = await findCustomerInUserCompanies(Number(id), userId);
    if (!customer) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    const updatedCustomer = await updateCustomer(Number(id), customer.company_id!, parsedData);
    return updatedCustomer;
  }
  catch (error) {
    throw handleError(error, { route: "customers.[id].put", user: event.context.user?.id });
  }
});
