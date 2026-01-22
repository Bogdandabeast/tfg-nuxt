type SendEmailPayload = {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function SendEmail(data: SendEmailPayload): Promise<unknown> {
  const apiRoute = process.env.RESEND_API;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiRoute || !apiKey) {
    throw new Error("Resend API configuration missing: apiRoute or apiKey");
  }

  try {
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
  catch (error) {
    throw new Error(`Email send failed: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}
