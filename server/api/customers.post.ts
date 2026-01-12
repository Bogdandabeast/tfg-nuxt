import { createCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { customerCreateSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);
  const data = customerCreateSchema.parse(body);

  // TODO: Add authorization to check if user has access to this company
  const newCustomer = await createCustomer(data);

  return newCustomer;
});
