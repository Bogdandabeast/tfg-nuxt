import { findCustomerInUserCompanies, updateCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerIdParamSchema, customerUpdateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id } = customerIdParamSchema.parse(event.context.params);

    const body = await readBody(event);
    const parsedData = customerUpdateSchema.parse(body);

    const userId = event.context.user.id;
    const customer = await findCustomerInUserCompanies(id, userId);
    if (!customer) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    if (!customer.company_id) {
      throw createError({ statusCode: 400, statusMessage: "Customer company not found" });
    }

    const updatedCustomer = await updateCustomer(id, customer.company_id, parsedData);
    return updatedCustomer;
  }
  catch (error) {
    throw handleError(error, { route: "customers.[id].put", user: event.context.user?.id });
  }
});
