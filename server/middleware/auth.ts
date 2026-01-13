import type { UserWithId } from "../../lib/auth";

import { auth } from "../../lib/auth";

function isUserWithId(x: unknown): x is UserWithId {
  return typeof x === "object" && x !== null && "id" in x && typeof x.id === "string";
}

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  const user = session?.user;
  event.context.user = isUserWithId(user) ? user : undefined;
  if (event.path.startsWith("/dashboard")) {
    if (!session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
