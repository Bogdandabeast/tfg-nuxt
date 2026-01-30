import type { SendEmailData } from "~~/types/api";
import { z } from "zod";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

const sendEmailSchema = z.object({
  from: z.string().email(),
  to: z.string().email(),
  replyTo: z.string().email(),
  subject: z.string().min(1),
  text: z.string().optional(),
  html: z.string().optional(),
});

export async function sendEmail(data: SendEmailData) {
  try {
    const validatedData = sendEmailSchema.parse(data);
    const result = await $fetch(String(process.env.RESEND_API), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: validatedData,
    });
    return result;
  }
  catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
