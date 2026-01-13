import type { H3Event, H3EventContext } from "h3";
import type { UserWithId } from "~~/lib/auth";
import { z } from "zod";
import { auth } from "~~/lib/auth";

const userWithIdSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().email(),
  image: z.string().nullish(),
  emailVerified: z.boolean().nullish(),
  createdAt: z.coerce.date().nullish(),
  updatedAt: z.coerce.date().nullish(),
});

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
      const validatedUser = userWithIdSchema.parse(session.user);
      event.context.user = validatedUser;
    }

    return handler(event as AuthenticatedEvent);
  });
}
