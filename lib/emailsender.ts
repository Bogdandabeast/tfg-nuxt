type SendEmail = {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail(data: SendEmail) {
  const apiRoute = process.env.RESEND_API;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiRoute || !apiKey) {
    throw new Error("Configura resend mamon");
  }

  const response = await $fetch(apiRoute, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: data,
  });

  return response;
}
