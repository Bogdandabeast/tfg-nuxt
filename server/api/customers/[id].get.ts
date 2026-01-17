import { findCustomerInUserCompanies } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerIdParamSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = customerIdParamSchema.parse(event.context.params);

    // Check if user has access to the customer's company
    const userId = event.context.user.id;
    const customer = await findCustomerInUserCompanies(id, userId);
    if (!customer) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { customer };
  }
  catch (error) {
    throw handleError(error, { route: "customers.[id].get", user: event.context.user?.id });
  }
});
