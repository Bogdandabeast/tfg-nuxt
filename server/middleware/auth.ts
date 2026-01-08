import { auth } from "~~/lib/auth";

export default defineEventHandler(async (event) => {
  // This middleware is for API routes, no need to run on assets or pages
  if (!event.path.startsWith("/api/")) {
    return;
  }

  // The auth handler itself handles the /api/auth routes
  if (event.path.startsWith("/api/auth/")) {
    return;
  }

  try {
    const session = await auth.api.getSession({ headers: event.headers });
    if (session?.user) {
      event.context.user = session.user;
    }
  }
  catch (error) {
    // Could not get session, user will be logged out.
    // This can happen if the session is invalid or expired.
    // The defineAuthenticatedEventHandler will handle the 401 response.
    console.error("Failed to fetch session in server middleware:", error);
    event.context.user = null;
  }
});
