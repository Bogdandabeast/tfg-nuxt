import { createSale } from "~~/lib/db/queries/sales";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import { handleError } from "~~/utils/error-handler";
import { createSaleSchema } from "~~/utils/schemas/sales";

export default defineAuthenticatedEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const company_id = event.context.session?.company_id;
    if (!company_id) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    const validatedData = createSaleSchema.parse({ ...body, company_id });

    const newSale = await createSale(validatedData);
    return { sale: newSale };
  }
  catch (error) {
    handleError(error, { route: "sales.post", user: event.context.user?.id });
  }
});
