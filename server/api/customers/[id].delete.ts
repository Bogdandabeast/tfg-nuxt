import { deleteCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const customerId = Number(event.context.params?.id);
  if (!customerId || Number.isNaN(customerId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid customer ID",
    });
  }

  // TODO: Add authorization to check if user has access to this customer
  const deleted = await deleteCustomer(customerId);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  return { success: true, id: customerId };
});
