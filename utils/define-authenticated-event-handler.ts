import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "~~/lib/auth";
import { auth } from "~~/lib/auth";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      const session = await auth.api.getSession(event);
      if (!session?.user) {
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
        });
      }
      event.context.user = session.user as UserWithId;
    }

    return handler(event as AuthenticatedEvent);
  });
}
