import { H3Error } from "h3";

export function handleError(error: unknown, context?: Record<string, unknown>): never {
  if (error instanceof H3Error) {
    throw error;
  }

  if (error.name === "ZodError") {
    console.warn("Validation error:", error.errors, context);
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      data: error.errors,
    });
  }

  // Handle database errors
  if (error.code) {
    // Drizzle ORM errors
    if (error.code === "23505") { // unique violation
      console.warn("Database unique violation:", error.message, context);
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict",
        data: "Resource already exists",
      });
    }
    if (error.code === "23503") { // foreign key violation
      console.warn("Database foreign key violation:", error.message, context);
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: "Invalid reference",
      });
    }
  }

  // Log the error
  console.error("Unhandled server error:", error.message, error.stack, context);

  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
}
