import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { deleteCustomer, getCustomerById } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  // Validate CSRF token
  const csrfToken = getHeader(event, "csrf-token");
  if (!csrfToken) {
    throw createError({ statusCode: 403, statusMessage: "Missing CSRF token" });
  }

  try {
    const customerId = Number(event.context.params?.id);
    if (!customerId || Number.isNaN(customerId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid customer ID",
      });
    }

    // Get the customer to check ownership
    const rows = await getCustomerById(customerId);
    const customerData = rows[0];
    if (!customerData || !customerData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    // Check if user has access to the customer's company
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);
    if (!userCompanyIds.includes(customerData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }

    // Delete the customer
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
    // Handle foreign key constraint violation
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
