import { z } from "zod";
import { updateCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

const customerUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  // company_id should probably not be mutable here
});

export default defineAuthenticatedEventHandler(async (event) => {
  const customerId = Number(event.context.params?.id);
  if (!customerId || isNaN(customerId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid customer ID",
    });
  }

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
});
