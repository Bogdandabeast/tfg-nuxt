import { createSale } from "~~/lib/db/queries/sales";
import { createSaleSchema } from "~~/utils/sales.schema";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    // const validatedData = await createSaleSchema.parseAsync({ ...body, company_id: companyId });

    const newSale = await createSale(body);
    return { sale: newSale };
  }
  catch (error) {
    // Handle validation errors from Zod
    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: error.errors,
      });
    }
    // Handle other potential errors
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
