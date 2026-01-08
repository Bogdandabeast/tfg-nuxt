import { getCustomerById } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const customerId = Number(event.context.params?.id);

  if (!customerId || isNaN(customerId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid customer ID",
    });
  }

  // TODO: Add authorization to check if user has access to this customer
  const customer = await getCustomerById(customerId);

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  return customer;
});
