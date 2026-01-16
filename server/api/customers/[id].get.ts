import { getCompaniesByUserId } from "~~/lib/db/queries/company";
import { getCustomerById } from "~~/lib/db/queries/customers";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { customerIdParamSchema } from "~~/utils/schemas/customers";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const { id } = customerIdParamSchema.parse(event.context.params);

    const customer = await getCustomerById(id);
    if (!customer || !customer.length) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const customerData = customer[0]!;
    if (!customerData.company_id) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    // Check if user has access to the customer's company
    const userId = event.context.user.id;
    const userCompanies = await getCompaniesByUserId(userId);
    const userCompanyIds = userCompanies.map(c => c.id);
    if (!userCompanyIds.includes(customerData.company_id)) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return { customer: customerData };
  }
  catch (error) {
    throw handleError(error, { route: "customers.[id].get", user: event.context.user?.id });
  }
});
