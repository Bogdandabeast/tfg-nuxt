import { updateCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerIdParamSchema, customerUpdateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id: customerId } = customerIdParamSchema.parse(event.context.params);

    const body = await readBody(event);
    const data = customerUpdateSchema.parse(body);

    // TODO: Add authorization to check if user has access to this customer
    const updated = await updateCustomer(customerId, data);

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: "Customer not found",
      });
    }

    return updated;
  }
  catch (error) {
    handleError(error, { route: "customers.[id].put", user: event.context.user?.id });
  }
});
