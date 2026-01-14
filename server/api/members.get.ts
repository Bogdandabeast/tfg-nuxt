export default defineEventHandler(async () => {
  const authStore = useAuthStore();
  await authStore.init();

  if (!authStore.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // For now, return the current user as the only member
  // In a real app, this would fetch all organization members
  const members = [authStore.user];

  return members;
});
