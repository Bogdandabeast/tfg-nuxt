export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // For now, return the current user as the only member
  // In a real app, this would fetch all organization members
  const members = [user];

  return members;
});
