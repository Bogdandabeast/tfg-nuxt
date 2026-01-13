import { H3Error } from "h3";

export function getFetchErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "data" in error) {
    const h3Error = error as { data: { statusMessage?: string; message?: string } | string };
    if (typeof h3Error.data === "object" && h3Error.data !== null) {
      return h3Error.data.statusMessage || h3Error.data.message || "Unknown error";
    }
    return String(h3Error.data) || "Unknown error";
  }
  return "Unknown error";
}

export function handleError(error: unknown, context?: Record<string, unknown>): never {
  if (error instanceof H3Error) {
    throw error;
  }

  // Type guard for ZodError
  if (error !== null && typeof error === "object" && "name" in error && error.name === "ZodError" && "errors" in error) {
    const zodError = error as { errors: unknown };
    console.warn("Validation error:", zodError.errors, context);
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      data: zodError.errors,
    });
  }

  // Handle database errors
  const hasCode = error !== null && typeof error === "object" && "code" in error;
  const errorWithCode = hasCode ? (error as { code: string; message?: string }) : null;

  if (errorWithCode?.code) {
    // Drizzle ORM errors
    if (errorWithCode.code === "23505") { // unique violation
      console.warn("Database unique violation:", errorWithCode.message, context);
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict",
        data: "Resource already exists",
      });
    }
    if (errorWithCode.code === "23503") { // foreign key violation
      console.warn("Database foreign key violation:", errorWithCode.message, context);
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: "Invalid reference",
      });
    }
  }

  // Log the error
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  console.error("Unhandled server error:", errorMessage, errorStack, context);

  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
}
