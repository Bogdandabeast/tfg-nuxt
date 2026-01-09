import { createCustomer } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

// const customerCreateSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email"),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   company_id: z.number().int(),
// });

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody(event);

  // const data = customerCreateSchema.parse(body);
  const data = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    company_id: body.company_id,
  };

  // TODO: Add authorization to check if user has access to this company
  const newCustomer = await createCustomer(data);

  return newCustomer;
});
