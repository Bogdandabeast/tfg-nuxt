import { H3Error } from "h3";

export function getTranslatedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "data" in error) {
    const h3Error = error as { data: { statusMessage?: string; message?: string } | string };
    if (typeof h3Error.data === "object" && h3Error.data !== null) {
      return h3Error.data.statusMessage || h3Error.data.message || "errors.unknown";
    }
    return String(h3Error.data) || "errors.unknown";
  }
  return "errors.unknown";
}

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

  if (error !== null && typeof error === "object" && "name" in error && error.name === "ZodError" && "errors" in error) {
    const zodError = error as { errors: unknown };
    console.warn("Validation error:", zodError.errors, context);
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      data: zodError.errors,
    });
  }

  
  const hasCode = error !== null && typeof error === "object" && "code" in error;
  const errorWithCode = hasCode ? (error as { code: string; message?: string }) : null;

  if (errorWithCode?.code) {
    if (errorWithCode.code === "23505") {
      console.warn("Database unique violation:", errorWithCode.message, context);
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict",
        data: "errors.resourceExists",
      });
    }
    if (errorWithCode.code === "23503") {
      if (typeof context?.route === "string" && context.route.includes(".delete")) {
        console.warn("Cannot delete entity due to foreign key constraint:", errorWithCode.message, context);
        throw createError({
          statusCode: 409,
          statusMessage: "Conflict",
          data: "errors.cannotDeleteInUse",
        });
      }
      console.warn("Database foreign key violation:", errorWithCode.message, context);
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: "errors.invalidReference",
      });
    }
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  console.error("Unhandled server error:", errorMessage, errorStack, context);

  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
}
