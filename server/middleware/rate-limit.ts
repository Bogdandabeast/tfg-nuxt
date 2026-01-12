// Simple in-memory rate limiter for demo purposes
// In production, use Redis or a proper rate limiting service
const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export default defineEventHandler((event) => {
  const ip = event.node.req.socket?.remoteAddress || "127.0.0.1";
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return; // Allow
  }

  const userRequests = requests.get(ip)!;

  if (now > userRequests.resetTime) {
    userRequests.count = 1;
    userRequests.resetTime = now + WINDOW_MS;
    return; // Allow
  }

  userRequests.count += 1;

  if (userRequests.count > MAX_REQUESTS) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        message: "Rate limit exceeded. Try again later.",
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
      },
    });
  }
});
