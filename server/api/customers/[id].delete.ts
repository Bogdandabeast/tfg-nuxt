import { deleteCustomer, findCustomerInUserCompanies } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerIdParamSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const { id: customerId } = customerIdParamSchema.parse(event.context.params);

    const userId = event.context.user.id;
    const customerData = await findCustomerInUserCompanies(customerId, userId);
    if (!customerData || !customerData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    const deleted = await deleteCustomer(customerId, customerData.company_id);

    if (!deleted.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Customer not found",
      });
    }

    return { success: true, id: customerId };
  }
  catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23503") {
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict",
        data: "Cannot delete this customer because it is currently in use by sales",
      });
    }
    throw handleError(error, { route: "customers.[id].delete", user: event.context.user?.id });
  }
});
